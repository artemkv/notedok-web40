import {
  CommandType,
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
  NoteCreatingFromText,
  NoteCreatingFromTitle,
  NoteDeleting,
  NoteLoading,
  NoteRenaming,
  NoteRestoring,
  NoteSavingText,
} from "../model";
import { ApiError } from "../restapi";
import { getFile, getFiles, renameFile } from "../sessionapi";

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

      // Sort alphabetically
      files.sort((a, b) =>
        a.fileName.localeCompare(b.fileName, undefined, { sensitivity: "base" })
      );

      dispatch({
        type: EventType.RetrieveFileListSuccess,
        fileList: files.map((f) => f.fileName),
      });
    } catch (err) {
      dispatch({
        type: EventType.RestApiError,
        err: `${err}`,
      });
    }
  },
});

export const LoadNoteText = (note: NoteLoading): LoadNoteTextCommand => ({
  type: CommandType.LoadNoteText,
  note,
  execute: (dispatch) => {
    try {
      getFile(note.path).then((text: string) => {
        dispatch({
          type: EventType.LoadNoteTextSuccess,
          note,
          text,
        });
      });
    } catch (err) {
      dispatch({
        type: EventType.NoteLoadFailed,
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
  execute: (dispatch) => {
    // TODO:
    setTimeout(() => {
      dispatch({
        type: EventType.NoteTextSaved,
        noteId: note.id,
      });
    }, 3000);
  },
});

export const CreateNewNoteWithTitle = (
  note: NoteCreatingFromTitle
): CreateNewNoteWithTitleCommand => ({
  type: CommandType.CreateNewNoteWithTitle,
  note,
  execute: (dispatch) => {
    // TODO:
    setTimeout(() => {
      dispatch({
        type: EventType.NoteCreated,
        noteId: note.id,
        path: "TODO",
      });
    }, 3000);
  },
});

export const CreateNewNoteWithText = (
  note: NoteCreatingFromText
): CreateNewNoteWithTextCommand => ({
  type: CommandType.CreateNewNoteWithText,
  note,
  execute: (dispatch) => {
    // TODO:
    setTimeout(() => {
      dispatch({
        type: EventType.NoteCreated,
        noteId: note.id,
        path: "TODO",
      });
    }, 3000);
  },
});

export const DeleteNote = (note: NoteDeleting): DeleteNoteCommand => ({
  type: CommandType.DeleteNote,
  note,
  execute: (dispatch) => {
    // TODO:
    setTimeout(() => {
      dispatch({
        type: EventType.NoteDeleted,
        noteId: note.id,
      });
    }, 3000);
  },
});

export const RestoreNote = (note: NoteRestoring): RestoreNoteCommand => ({
  type: CommandType.RestoreNote,
  note,
  execute: (dispatch) => {
    // TODO:
    setTimeout(() => {
      dispatch({
        type: EventType.NoteRestored,
        noteId: note.id,
      });
    }, 3000);
  },
});
