import { ChangeType, makeChannel } from "../changeHandler";
import {
  CommandType,
  LoadNoteTextCommand,
  RetrieveFileListCommand,
  SaveChangesCommand,
} from "../commands";
import { EventType } from "../events";
import { NoteLoading } from "../model";
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

const updateChannel = makeChannel();

updateChannel.attachHandler(async (c) => {
  console.log(JSON.stringify(c));

  setTimeout(() => {
    c.onSuccess();
  }, 3000);

  // TODO: handle errors
});

export const SaveChanges = (
  noteId: string,
  newTitle: string,
  newText: string
): SaveChangesCommand => ({
  type: CommandType.SaveChanges,
  noteId,
  newTitle,
  newText,
  execute: (dispatch) => {
    updateChannel.write({
      type: ChangeType.Save,
      noteId,
      newTitle,
      newText,
      onSuccess: () => {
        dispatch({
          type: EventType.NoteAllChangesSaved,
          noteId,
        });
      },
      onFailure: () => {},
    });
  },
});
