import { getTitleFromPath } from "./conversion";
import {
  Maybe,
  MaybeOfNone,
  NoteConvertingToMarkdown,
  NoteCreatingFromText,
  NoteCreatingFromTitle,
  NoteDeleted,
  NoteDeleting,
  NoteFailedToConvertToMarkdown,
  NoteFailedToCreateFromText,
  NoteFailedToCreateFromTitle,
  NoteFailedToDelete,
  NoteFailedToLoad,
  NoteFailedToRename,
  NoteFailedToRestore,
  NoteFailedToSaveText,
  NoteLoaded,
  NoteLoading,
  NoteNew,
  NoteRef,
  NoteRenaming,
  NoteRestoring,
  NoteSavingText,
  NoteState,
} from "./model";

export const createNewNoteRef = (
  id: number,
  path: string,
  lastModified: Date,
  draft: Maybe<string>
): NoteRef => {
  return {
    state: NoteState.Ref,

    id: "note_" + id.toString(),
    path,
    title: getTitleFromPath(path),
    lastModified,
    draft,
  };
};

export const noteRefToLoading = (note: NoteRef): NoteLoading => {
  return {
    state: NoteState.Loading,

    id: note.id,
    path: note.path,
    title: note.title,
    lastModified: note.lastModified,
    draft: note.draft,
  };
};

export const noteLoadingToFailedToLoad = (
  note: NoteLoading,
  err: string
): NoteFailedToLoad => {
  return {
    state: NoteState.FailedToLoad,

    id: note.id,
    path: note.path,
    title: note.title,
    lastModified: note.lastModified,
    draft: note.draft,

    err,
  };
};

export const noteFailedToLoadToLoading = (
  note: NoteFailedToLoad
): NoteLoading => {
  return {
    state: NoteState.Loading,

    id: note.id,
    path: note.path,
    title: note.title,
    lastModified: note.lastModified,
    draft: note.draft,
  };
};

export const noteLoadingToLoaded = (
  note: NoteLoading,
  text: string
): NoteLoaded => {
  return {
    state: NoteState.Loaded,

    id: note.id,
    path: note.path,
    title: note.title,
    text,
    lastModified: note.lastModified,
    draft: note.draft,
  };
};

export const noteLoadedToRenaming = (
  note: NoteLoaded,
  newTitle: string
): NoteRenaming => {
  return {
    state: NoteState.Renaming,

    id: note.id,
    path: note.path,
    title: note.title,
    text: note.text,
    lastModified: note.lastModified,
    draft: note.draft,

    newTitle,
  };
};

export const noteRenamingToLoaded = (
  note: NoteRenaming,
  newPath: string
): NoteLoaded => {
  return {
    state: NoteState.Loaded,

    id: note.id,
    path: newPath,
    title: note.newTitle,
    text: note.text,
    lastModified: note.lastModified,
    draft: note.draft,
  };
};

export const noteRenamingToFailedToRename = (
  note: NoteRenaming,
  err: string
): NoteFailedToRename => {
  return {
    state: NoteState.FailedToRename,

    id: note.id,
    path: note.path,
    title: note.title,
    text: note.text,
    lastModified: note.lastModified,
    draft: note.draft,

    newTitle: note.newTitle,

    err,
  };
};

export const noteFailedToRenameToRenaming = (
  note: NoteFailedToRename
): NoteRenaming => {
  return {
    state: NoteState.Renaming,

    id: note.id,
    path: note.path,
    title: note.title,
    text: note.text,
    lastModified: note.lastModified,
    draft: note.draft,

    newTitle: note.newTitle,
  };
};

export const noteFailedToRenameToLoaded = (
  note: NoteFailedToRename
): NoteLoaded => {
  return {
    state: NoteState.Loaded,

    id: note.id,
    path: note.path,
    title: note.title,
    text: note.text,
    lastModified: note.lastModified,
    draft: note.draft,
  };
};

export const noteLoadedToSavingText = (
  note: NoteLoaded,
  newText: string
): NoteSavingText => {
  return {
    state: NoteState.SavingText,

    id: note.id,
    path: note.path,
    title: note.title,
    text: note.text,
    lastModified: note.lastModified,

    newText,
  };
};

export const noteSavingTextToLoaded = (note: NoteSavingText): NoteLoaded => {
  return {
    state: NoteState.Loaded,

    id: note.id,
    path: note.path,
    title: note.title,
    text: note.newText,
    lastModified: note.lastModified,
    draft: MaybeOfNone,
  };
};

export const noteSavingTextToFailedToSaveText = (
  note: NoteSavingText,
  err: string
): NoteFailedToSaveText => {
  return {
    state: NoteState.FailedToSaveText,

    id: note.id,
    path: note.path,
    title: note.title,
    text: note.text,
    lastModified: note.lastModified,

    newText: note.newText,

    err,
  };
};

export const noteFailedToSaveTextToSavingText = (
  note: NoteFailedToSaveText
): NoteSavingText => {
  return {
    state: NoteState.SavingText,

    id: note.id,
    path: note.path,
    title: note.title,
    text: note.text,
    lastModified: note.lastModified,

    newText: note.newText,
  };
};

export const noteFailedToSaveTextToLoaded = (
  note: NoteFailedToSaveText
): NoteLoaded => {
  return {
    state: NoteState.Loaded,

    id: note.id,
    path: note.path,
    title: note.title,
    text: note.text,
    lastModified: note.lastModified,
    draft: MaybeOfNone,
  };
};

export const noteLoadedToDeleting = (note: NoteLoaded): NoteDeleting => {
  return {
    state: NoteState.Deleting,

    id: note.id,
    path: note.path,
    title: note.title,
    text: note.text,
    lastModified: note.lastModified,
  };
};

export const noteDeletingToDeleted = (note: NoteDeleting): NoteDeleted => {
  return {
    state: NoteState.Deleted,

    id: note.id,
    path: note.path,
    title: note.title,
    text: note.text,
    lastModified: note.lastModified,
  };
};

export const noteDeletingToFailedToDelete = (
  note: NoteDeleting,
  err: string
): NoteFailedToDelete => {
  return {
    state: NoteState.FailedToDelete,

    id: note.id,
    path: note.path,
    title: note.title,
    text: note.text,
    lastModified: note.lastModified,

    err,
  };
};

export const noteFailedToDeleteToDeleting = (
  note: NoteFailedToDelete
): NoteDeleting => {
  return {
    state: NoteState.Deleting,

    id: note.id,
    path: note.path,
    title: note.title,
    text: note.text,
    lastModified: note.lastModified,
  };
};

export const noteFailedToDeleteToLoaded = (
  note: NoteFailedToDelete
): NoteLoaded => {
  return {
    state: NoteState.Loaded,

    id: note.id,
    path: note.path,
    title: note.title,
    text: note.text,
    lastModified: note.lastModified,
    draft: MaybeOfNone,
  };
};

export const noteDeletedToRestoring = (note: NoteDeleted): NoteRestoring => {
  return {
    state: NoteState.Restoring,

    id: note.id,
    path: note.path,
    title: note.title,
    text: note.text,
    lastModified: note.lastModified,
  };
};

export const noteRestoringToLoaded = (note: NoteRestoring): NoteLoaded => {
  return {
    state: NoteState.Loaded,

    id: note.id,
    path: note.path,
    title: note.title,
    text: note.text,
    lastModified: note.lastModified,
    draft: MaybeOfNone,
  };
};

export const noteRestoringToLoadedWithNewPath = (
  note: NoteRestoring,
  newPath: string
): NoteLoaded => {
  return {
    state: NoteState.Loaded,

    id: note.id,
    path: newPath,
    title: note.title,
    text: note.text,
    lastModified: note.lastModified,
    draft: MaybeOfNone,
  };
};

export const noteRestoringToFailedToRestore = (
  note: NoteRestoring,
  err: string
): NoteFailedToRestore => {
  return {
    state: NoteState.FailedToRestore,

    id: note.id,
    path: note.path,
    title: note.title,
    text: note.text,
    lastModified: note.lastModified,

    err,
  };
};

export const noteFailedToRestoreToRestoring = (
  note: NoteFailedToRestore
): NoteRestoring => {
  return {
    state: NoteState.Restoring,

    id: note.id,
    path: note.path,
    title: note.title,
    text: note.text,
    lastModified: note.lastModified,
  };
};

export const noteFailedToRestoreToDeleted = (
  note: NoteFailedToRestore
): NoteDeleted => {
  return {
    state: NoteState.Deleted,

    id: note.id,
    path: note.path,
    title: note.title,
    text: note.text,
    lastModified: note.lastModified,
  };
};

export const createNewNote = (
  id: number,
  lastModified: Date,
  draft: Maybe<string>
): NoteNew => {
  return {
    state: NoteState.New,
    lastModified,
    draft,

    id: "note_" + id.toString(),
  };
};

export const noteNewToCreatingFromTitle = (
  note: NoteNew,
  title: string
): NoteCreatingFromTitle => {
  return {
    state: NoteState.CreatingFromTitle,

    id: note.id,
    title,
    lastModified: note.lastModified,
    draft: note.draft,
  };
};

export const noteCreatingFromTitleToLoaded = (
  note: NoteCreatingFromTitle,
  path: string
): NoteLoaded => {
  return {
    state: NoteState.Loaded,

    id: note.id,
    path,
    title: note.title,
    text: "",
    lastModified: note.lastModified,
    draft: note.draft,
  };
};

export const noteCreatingFromTitleToFailedToCreateFromTitle = (
  note: NoteCreatingFromTitle,
  err: string
): NoteFailedToCreateFromTitle => {
  return {
    state: NoteState.FailedToCreateFromTitle,

    id: note.id,
    title: note.title,
    lastModified: note.lastModified,
    draft: note.draft,

    err,
  };
};

export const noteFailedToCreateFromTitleToCreatingFromTitle = (
  note: NoteFailedToCreateFromTitle
): NoteCreatingFromTitle => {
  return {
    state: NoteState.CreatingFromTitle,

    id: note.id,
    title: note.title,
    lastModified: note.lastModified,
    draft: note.draft,
  };
};

export const noteFailedToCreateFromTitleToNew = (
  note: NoteFailedToCreateFromTitle
): NoteNew => {
  return {
    state: NoteState.New,

    id: note.id,
    lastModified: note.lastModified,
    draft: note.draft,
  };
};

export const noteNewToCreatingFromText = (
  note: NoteNew,
  text: string
): NoteCreatingFromText => {
  return {
    state: NoteState.CreatingFromText,

    id: note.id,
    text,
    lastModified: note.lastModified,
  };
};

export const noteCreatingFromTextToLoaded = (
  note: NoteCreatingFromText,
  path: string
): NoteLoaded => {
  return {
    state: NoteState.Loaded,

    id: note.id,
    path,
    title: "",
    text: note.text,
    lastModified: note.lastModified,
    draft: MaybeOfNone,
  };
};

export const noteCreatingFromTextToFailedToCreateFromText = (
  note: NoteCreatingFromText,
  err: string
): NoteFailedToCreateFromText => {
  return {
    state: NoteState.FailedToCreateFromText,

    id: note.id,
    text: note.text,
    lastModified: note.lastModified,

    err,
  };
};

export const noteFailedToCreateFromTextToCreatingFromText = (
  note: NoteFailedToCreateFromText
): NoteCreatingFromText => {
  return {
    state: NoteState.CreatingFromText,

    id: note.id,
    text: note.text,
    lastModified: note.lastModified,
  };
};

export const noteFailedToCreateFromTextToNew = (
  note: NoteFailedToCreateFromText
): NoteNew => {
  return {
    state: NoteState.New,

    id: note.id,
    lastModified: note.lastModified,
    draft: MaybeOfNone,
  };
};

export const noteLoadedToConvertingToMarkdown = (
  note: NoteLoaded
): NoteConvertingToMarkdown => {
  return {
    state: NoteState.ConvertingToMarkdown,

    id: note.id,
    path: note.path,
    title: note.title,
    text: note.text,
    lastModified: note.lastModified,
  };
};

export const noteConvertingToMarkdownToFailedToConvertToMarkdown = (
  note: NoteConvertingToMarkdown,
  err: string
): NoteFailedToConvertToMarkdown => {
  return {
    state: NoteState.FailedToConvertToMarkdown,

    id: note.id,
    path: note.path,
    title: note.title,
    text: note.text,
    lastModified: note.lastModified,

    err,
  };
};

export const noteConvertingToMarkdownToLoaded = (
  note: NoteConvertingToMarkdown,
  newPath: string,
  newText: string
): NoteLoaded => {
  return {
    state: NoteState.Loaded,

    id: note.id,
    path: newPath,
    title: getTitleFromPath(newPath),
    text: newText,
    lastModified: note.lastModified,
    draft: MaybeOfNone,
  };
};

export const noteFailedToConvertToMarkdownToConvertingToMarkdown = (
  note: NoteFailedToConvertToMarkdown
): NoteConvertingToMarkdown => {
  return {
    state: NoteState.ConvertingToMarkdown,

    id: note.id,
    path: note.path,
    title: note.title,
    text: note.text,
    lastModified: note.lastModified,
  };
};

export const noteFailedToConvertToMarkdownToLoaded = (
  note: NoteFailedToConvertToMarkdown
): NoteLoaded => {
  return {
    state: NoteState.Loaded,

    id: note.id,
    path: note.path,
    title: note.title,
    text: note.text,
    lastModified: note.lastModified,
    draft: MaybeOfNone,
  };
};
