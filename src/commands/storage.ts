import {
  CommandType,
  ConvertToMarkdownCommand,
  ConvertToTextCommand,
  CreateNewNoteWithTextCommand,
  CreateNewNoteWithTitleCommand,
  DeleteNoteCommand,
  LoadNoteTextCommand,
  RenameNoteCommand,
  RestoreNoteCommand,
  RetrieveFileListCommand,
  SaveNoteTextCommand,
} from "../commands";
import {
  generatePathFromTitleMd,
  generatePathFromTitleText,
  isMarkdownFile,
} from "../conversion";
import { EventType } from "../events";
import {
  NoteConvertingToMarkdown,
  NoteConvertingToText,
  NoteCreatingFromText,
  NoteCreatingFromTitle,
  NoteDeleting,
  NoteFormat,
  NoteLoading,
  NoteRenaming,
  NoteRestoring,
  NoteSavingText,
} from "../model";
import { ApiError } from "../restapi";
import {
  deleteFile,
  getFile,
  getFiles,
  postFile,
  putFile,
  renameFile,
} from "../sessionapi";
import { wiki2md } from "../wikitomd";
import { loadDrafts } from "./draftStorage";
import { loadPrefs } from "./preferencesStorage";

interface FileData {
  fileName: string;
  lastModified: string;
  etag: string;
}

interface GetFilesResponse {
  files: FileData[];
  hasMore: boolean;
  nextContinuationToken: string;
}

interface FileDataWithDate {
  fileName: string;
  lastModified: Date;
  etag: string;
}

const mapToFiles = (fileData: FileData[]): FileDataWithDate[] => {
  return fileData.map((f) => ({
    fileName: f.fileName,
    lastModified: new Date(f.lastModified),
    etag: f.etag,
  }));
};

const PAGE_SIZE = 1000;

const encode = (text: string) => {
  const textEncoder = new TextEncoder(); // always utf-8
  return textEncoder.encode(text); // returns a Uint8Array (which is TypedArray)
};

export const RetrieveFileList = (): RetrieveFileListCommand => ({
  type: CommandType.RetrieveFileList,
  execute: async (dispatch) => {
    try {
      let files: FileDataWithDate[] = [];

      // Retrieve the first batch
      let getFilesResponse: GetFilesResponse = await getFiles(PAGE_SIZE, "");
      files = [...files, ...mapToFiles(getFilesResponse.files)];

      // Keep retrieving until all
      while (getFilesResponse.hasMore) {
        getFilesResponse = await getFiles(
          PAGE_SIZE,
          getFilesResponse.nextContinuationToken
        );
        files = [...files, ...mapToFiles(getFilesResponse.files)];
      }

      // Combine with drafts/prefs here for simplicity
      const drafts = loadDrafts();
      const prefs = loadPrefs();

      dispatch({
        type: EventType.RetrieveFileListSuccess,
        fileList: files.map((f) => ({
          fileName: f.fileName,
          lastModified: f.lastModified,
        })),
        drafts,
        prefs,
      });
    } catch (err) {
      dispatch({
        type: EventType.FailedToRetrieveFileList,
        err: `${err}`,
      });
    }
  },
});

export const LoadNoteText = (note: NoteLoading): LoadNoteTextCommand => ({
  type: CommandType.LoadNoteText,
  note,
  execute: async (dispatch) => {
    try {
      const text = await getFile(note.path);
      dispatch({
        type: EventType.LoadNoteTextSuccess,
        note,
        text,
      });
    } catch (err) {
      dispatch({
        type: EventType.FailedToLoadNote,
        note,
        err: `${err}`,
      });
    }
  },
});

// Renaming doesn't change the file format (.md is renamed to .md, .txt to .txt)
export const RenameNote = (note: NoteRenaming): RenameNoteCommand => ({
  type: CommandType.RenameNote,
  note,
  execute: async (dispatch) => {
    const isMarkdown = isMarkdownFile(note.path);

    // First time try with path derived from title
    // Unless title is empty, in which case we immediately ask for a unique one
    const newPath = isMarkdown
      ? generatePathFromTitleMd(note.newTitle, note.newTitle === "")
      : generatePathFromTitleText(note.newTitle, note.newTitle === "");
    try {
      await renameFile(note.path, newPath);
      dispatch({
        type: EventType.NoteRenamed,
        noteId: note.id,
        newPath,
      });
    } catch (err) {
      if ((err as ApiError).statusCode === 409) {
        // Regenerate path from title, this time focing uniqueness
        const newPath = isMarkdown
          ? generatePathFromTitleMd(note.newTitle, true)
          : generatePathFromTitleText(note.newTitle, true);
        try {
          await renameFile(note.path, newPath);
          dispatch({
            type: EventType.NoteRenamed,
            noteId: note.id,
            newPath,
          });
        } catch (err) {
          dispatch({
            type: EventType.FailedToRenameNote,
            noteId: note.id,
            err: `${err}`,
          });
        }
      } else {
        dispatch({
          type: EventType.FailedToRenameNote,
          noteId: note.id,
          err: `${err}`,
        });
      }
    }
  },
});

export const SaveNoteText = (note: NoteSavingText): SaveNoteTextCommand => ({
  type: CommandType.SaveNoteText,
  note,
  execute: async (dispatch) => {
    try {
      // Store at the exact path we loaded from
      await putFile(note.path, encode(note.newText));
      dispatch({
        type: EventType.NoteTextSaved,
        noteId: note.id,
      });
    } catch (err) {
      dispatch({
        type: EventType.FailedToSaveNoteText,
        noteId: note.id,
        err: `${err}`,
      });
    }
  },
});

export const CreateNewNoteWithTitle = (
  note: NoteCreatingFromTitle
): CreateNewNoteWithTitleCommand => ({
  type: CommandType.CreateNewNoteWithTitle,
  note,
  execute: async (dispatch) => {
    const isMarkdown = note.format == NoteFormat.Markdown;

    // Title is not empty, ensured by business, so we first try to store with path derived from the title
    const path = isMarkdown
      ? generatePathFromTitleMd(note.title, false)
      : generatePathFromTitleText(note.title, false);
    try {
      // Don't overwrite, in case not unique
      await postFile(path, encode(""));
      dispatch({
        type: EventType.NoteCreated,
        noteId: note.id,
        path,
      });
    } catch (err) {
      if ((err as ApiError).statusCode === 409) {
        // Regenerate path from title, this time enfocing uniqueness
        const newPath = isMarkdown
          ? generatePathFromTitleMd(note.title, true)
          : generatePathFromTitleText(note.title, true);
        try {
          await putFile(newPath, encode(""));
          dispatch({
            type: EventType.NoteCreated,
            noteId: note.id,
            path: newPath,
          });
        } catch (err) {
          dispatch({
            type: EventType.FailedToCreateNoteFromTitle,
            noteId: note.id,
            err: `${err}`,
          });
        }
      } else {
        dispatch({
          type: EventType.FailedToCreateNoteFromTitle,
          noteId: note.id,
          err: `${err}`,
        });
      }
    }
  },
});

export const CreateNewNoteWithText = (
  note: NoteCreatingFromText
): CreateNewNoteWithTextCommand => ({
  type: CommandType.CreateNewNoteWithText,
  note,
  execute: async (dispatch) => {
    const isMarkdown = note.format == NoteFormat.Markdown;

    // Here we know that title is empty, so no need to even try storing it with an original path
    // Immediately ask for a unique (empty) path
    const path = isMarkdown
      ? generatePathFromTitleMd("", true)
      : generatePathFromTitleText("", true);
    try {
      await putFile(path, encode(note.text));
      dispatch({
        type: EventType.NoteCreated,
        noteId: note.id,
        path,
      });
    } catch (err) {
      dispatch({
        type: EventType.FailedToCreateNoteFromText,
        noteId: note.id,
        err: `${err}`,
      });
    }
  },
});

export const DeleteNote = (note: NoteDeleting): DeleteNoteCommand => ({
  type: CommandType.DeleteNote,
  note,
  execute: async (dispatch) => {
    try {
      await deleteFile(note.path);
      dispatch({
        type: EventType.NoteDeleted,
        noteId: note.id,
      });
    } catch (err) {
      dispatch({
        type: EventType.FailedToDeleteNote,
        noteId: note.id,
        err: `${err}`,
      });
    }
  },
});

// Notes are restored in the same format (.md as .md, .txt as .txt)
export const RestoreNote = (note: NoteRestoring): RestoreNoteCommand => ({
  type: CommandType.RestoreNote,
  note,
  execute: async (dispatch) => {
    try {
      // Try to restore with exactly the same path as before, don't overwrite
      await postFile(note.path, encode(note.text));
      dispatch({
        type: EventType.NoteRestored,
        noteId: note.id,
      });
    } catch (err) {
      if ((err as ApiError).statusCode === 409) {
        const isMarkdown = isMarkdownFile(note.path);

        // The path that suddenly is taken (almost unrealistic)
        // Regenerate path from title, this time enfocing uniqueness
        const newPath = isMarkdown
          ? generatePathFromTitleMd(note.title, true)
          : generatePathFromTitleText(note.title, true);
        try {
          await putFile(newPath, encode(note.text));
          dispatch({
            type: EventType.NoteRestoredOnNewPath,
            noteId: note.id,
            path: newPath,
          });
        } catch (err) {
          dispatch({
            type: EventType.FailedToRestoreNote,
            noteId: note.id,
            err: `${err}`,
          });
        }
      } else {
        dispatch({
          type: EventType.FailedToRestoreNote,
          noteId: note.id,
          err: `${err}`,
        });
      }
    }
  },
});

export const ConvertToMarkdown = (
  note: NoteConvertingToMarkdown
): ConvertToMarkdownCommand => ({
  type: CommandType.ConvertToMarkdown,
  note,
  execute: async (dispatch) => {
    try {
      const newPath = await convertFileNameToMarkdown(note);
      const newText = await convertContentToMarkdown(note, newPath);

      dispatch({
        type: EventType.NoteConvertedToMarkdown,
        noteId: note.id,
        newPath,
        newText,
      });
    } catch (err) {
      dispatch({
        type: EventType.NoteFailedToConvertToMarkdown,
        noteId: note.id,
        err: `${err}`,
      });
    }
  },
});

const convertFileNameToMarkdown = async (note: NoteConvertingToMarkdown) => {
  const newPath = generatePathFromTitleMd(note.title, note.title === "");
  try {
    await renameFile(note.path, newPath);
    return newPath;
  } catch (err) {
    if ((err as ApiError).statusCode === 409) {
      // Regenerate path from title, this time focing uniqueness
      const newPath = generatePathFromTitleMd(note.title, true);
      await renameFile(note.path, newPath);
      return newPath;
    } else {
      throw err;
    }
  }
};

const convertContentToMarkdown = async (
  note: NoteConvertingToMarkdown,
  newPath: string
) => {
  const md = wiki2md(note.text);
  await putFile(newPath, encode(md));
  return md;
};

export const ConvertToText = (
  note: NoteConvertingToText
): ConvertToTextCommand => ({
  type: CommandType.ConvertToText,
  note,
  execute: async (dispatch) => {
    try {
      const newPath = await convertFileNameToText(note);
      const newText = await convertContentToText(note, newPath);

      dispatch({
        type: EventType.NoteConvertedToText,
        noteId: note.id,
        newPath,
        newText,
      });
    } catch (err) {
      dispatch({
        type: EventType.NoteFailedToConvertToText,
        noteId: note.id,
        err: `${err}`,
      });
    }
  },
});

const convertFileNameToText = async (note: NoteConvertingToText) => {
  const newPath = generatePathFromTitleText(note.title, note.title === "");
  try {
    await renameFile(note.path, newPath);
    return newPath;
  } catch (err) {
    if ((err as ApiError).statusCode === 409) {
      // Regenerate path from title, this time focing uniqueness
      const newPath = generatePathFromTitleText(note.title, true);
      await renameFile(note.path, newPath);
      return newPath;
    } else {
      throw err;
    }
  }
};

const convertContentToText = async (
  note: NoteConvertingToText,
  newPath: string
) => {
  await putFile(newPath, encode(note.text));
  return note.text;
};
