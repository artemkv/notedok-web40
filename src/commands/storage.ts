import {
  CommandType,
  DeleteNoteCommand,
  LoadNoteTextCommand,
  RenameNoteCommand,
  RestoreNoteCommand,
  RetrieveFileListCommand,
} from "../commands";
import { EventType } from "../events";
import {
  NoteDeleting,
  NoteLoading,
  NoteRenaming,
  NoteRestoring,
} from "../model";
import { getFile, getFiles } from "../sessionapi";

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

export const RenameNote = (note: NoteRenaming): RenameNoteCommand => ({
  type: CommandType.RenameNote,
  note,
  execute: (dispatch) => {
    // TODO:
    setTimeout(() => {
      dispatch({
        type: EventType.NoteRenamed,
        noteId: note.id,
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
