import { handleRetrieveFileListSuccess } from "./buisiness";
import { DoNothing } from "./commands";
import { EventType, RetrieveFileListSuccessEvent } from "./events";
import {
  AppStateAuthenticated,
  AuthenticationStatus,
  EditorState,
  MaybeType,
  NoteListState,
  NoteState,
  SortingOrder,
} from "./model";

test("Loading notes without drafts", () => {
  const event: RetrieveFileListSuccessEvent = {
    type: EventType.RetrieveFileListSuccess,
    fileList: [
      { fileName: "file1.md", lastModified: new Date(1) },
      { fileName: "file2.md", lastModified: new Date(2) },
      { fileName: "file3.txt", lastModified: new Date(3) },
    ],
    drafts: {
      version: 1,
      notes: {},
      newNotes: {},
    },
  };

  const expectedState: AppStateAuthenticated = {
    auth: AuthenticationStatus.Authenticated,
    noteList: {
      state: NoteListState.Retrieved,
      lastUsedNoteId: 2,
      notes: [
        {
          state: NoteState.Ref,
          id: "note_0",
          path: "file1.md",
          title: "file1",
          lastModified: new Date(1),
          draft: {
            type: MaybeType.None,
          },
        },
        {
          state: NoteState.Ref,
          id: "note_1",
          path: "file2.md",
          title: "file2",
          lastModified: new Date(2),
          draft: {
            type: MaybeType.None,
          },
        },
        {
          state: NoteState.Ref,
          id: "note_2",
          path: "file3.txt",
          title: "file3",
          lastModified: new Date(3),
          draft: {
            type: MaybeType.None,
          },
        },
      ],
      sortingOrder: SortingOrder.Alphabetic,
      selectedNoteId: "",
      searchText: "",
      editor: { state: EditorState.Inactive },
    },
  };

  const [newState, command] = handleRetrieveFileListSuccess(event);

  expect(newState).toEqual(expectedState);
  expect(command).toEqual(DoNothing);
});

test("Loading notes, existing note with draft", () => {
  const event: RetrieveFileListSuccessEvent = {
    type: EventType.RetrieveFileListSuccess,
    fileList: [
      { fileName: "file1.md", lastModified: new Date(1) },
      { fileName: "file2.md", lastModified: new Date(2) },
      { fileName: "file3.txt", lastModified: new Date(3) },
    ],
    drafts: {
      version: 1,
      notes: {
        "file2.md": "some text",
      },
      newNotes: {},
    },
  };

  const expectedState: AppStateAuthenticated = {
    auth: AuthenticationStatus.Authenticated,
    noteList: {
      state: NoteListState.Retrieved,
      lastUsedNoteId: 2,
      notes: [
        {
          state: NoteState.Ref,
          id: "note_0",
          path: "file1.md",
          title: "file1",
          lastModified: new Date(1),
          draft: {
            type: MaybeType.None,
          },
        },
        {
          state: NoteState.Ref,
          id: "note_1",
          path: "file2.md",
          title: "file2",
          lastModified: new Date(2),
          draft: {
            type: MaybeType.Some,
            value: "some text",
          },
        },
        {
          state: NoteState.Ref,
          id: "note_2",
          path: "file3.txt",
          title: "file3",
          lastModified: new Date(3),
          draft: {
            type: MaybeType.None,
          },
        },
      ],
      sortingOrder: SortingOrder.Alphabetic,
      selectedNoteId: "",
      searchText: "",
      editor: { state: EditorState.Inactive },
    },
  };

  const [newState, command] = handleRetrieveFileListSuccess(event);

  expect(newState).toEqual(expectedState);
  expect(command).toEqual(DoNothing);
});

test("Loading notes, existing note with draft, plus some new notes from drafts", () => {
  const event: RetrieveFileListSuccessEvent = {
    type: EventType.RetrieveFileListSuccess,
    fileList: [
      { fileName: "file1.md", lastModified: new Date(1) },
      { fileName: "file2.md", lastModified: new Date(2) },
      { fileName: "file3.txt", lastModified: new Date(3) },
    ],
    drafts: {
      version: 1,
      notes: {
        "file2.md": "some text",
      },
      newNotes: {
        "4": "new text 1",
        "5": "new text 2",
      },
    },
  };

  const expectedState: AppStateAuthenticated = {
    auth: AuthenticationStatus.Authenticated,
    noteList: {
      state: NoteListState.Retrieved,
      lastUsedNoteId: 4,
      notes: [
        {
          state: NoteState.New,
          id: "note_3",
          lastModified: new Date(4),
          draft: {
            type: MaybeType.Some,
            value: "new text 1",
          },
        },
        {
          state: NoteState.New,
          id: "note_4",
          lastModified: new Date(5),
          draft: {
            type: MaybeType.Some,
            value: "new text 2",
          },
        },
        {
          state: NoteState.Ref,
          id: "note_0",
          path: "file1.md",
          title: "file1",
          lastModified: new Date(1),
          draft: {
            type: MaybeType.None,
          },
        },
        {
          state: NoteState.Ref,
          id: "note_1",
          path: "file2.md",
          title: "file2",
          lastModified: new Date(2),
          draft: {
            type: MaybeType.Some,
            value: "some text",
          },
        },
        {
          state: NoteState.Ref,
          id: "note_2",
          path: "file3.txt",
          title: "file3",
          lastModified: new Date(3),
          draft: {
            type: MaybeType.None,
          },
        },
      ],
      sortingOrder: SortingOrder.Alphabetic,
      selectedNoteId: "",
      searchText: "",
      editor: { state: EditorState.Inactive },
    },
  };

  const [newState, command] = handleRetrieveFileListSuccess(event);

  expect(newState).toEqual(expectedState);
  expect(command).toEqual(DoNothing);
});
