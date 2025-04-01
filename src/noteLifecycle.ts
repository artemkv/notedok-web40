import { getTitleFromPath } from "./conversion";
import {
  NoteCreating,
  NoteDeleted,
  NoteDeleting,
  NoteFailedToCreate,
  NoteFailedToDelete,
  NoteFailedToLoad,
  NoteFailedToRestore,
  NoteFailedToSave,
  NoteLoaded,
  NoteLoading,
  NoteNew,
  NoteRef,
  NoteRestoring,
  NoteSaving,
  NoteState,
} from "./model";

export const createNewNoteRef = (id: number, path: string): NoteRef => {
  return {
    state: NoteState.Ref,

    id: "note_" + id.toString(),
    path,
    title: getTitleFromPath(path),
  };
};

export const noteRefToLoading = (note: NoteRef): NoteLoading => {
  return {
    state: NoteState.Loading,

    id: note.id,
    path: note.path,
    title: note.title,
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
  };
};

export const noteLoadedToSaving = (
  note: NoteLoaded,
  newTitle: string,
  newText: string
): NoteSaving => {
  return {
    state: NoteState.Saving,

    id: note.id,
    path: note.path,
    title: note.title,
    text: note.text,

    newTitle,
    newText,
  };
};

export const noteSavingToLoaded = (note: NoteSaving): NoteLoaded => {
  return {
    state: NoteState.Loaded,

    id: note.id,
    path: note.path,
    title: note.newTitle,
    text: note.newText,
  };
};

export const noteSavingToFailedToSave = (
  note: NoteSaving,
  err: string
): NoteFailedToSave => {
  return {
    state: NoteState.FailedToSave,

    id: note.id,
    path: note.path,
    title: note.newTitle,
    text: note.newText,

    newTitle: note.newTitle,
    newText: note.newText,

    err,
  };
};

export const noteFailedToSaveToSaving = (
  note: NoteFailedToSave
): NoteSaving => {
  return {
    state: NoteState.Saving,

    id: note.id,
    path: note.path,
    title: note.title,
    text: note.text,

    newTitle: note.newTitle,
    newText: note.newText,
  };
};

export const noteLoadedToDeleting = (note: NoteLoaded): NoteDeleting => {
  return {
    state: NoteState.Deleting,

    id: note.id,
    path: note.path,
    title: note.title,
    text: note.text,
  };
};

export const noteDeletingToDeleted = (note: NoteDeleting): NoteDeleted => {
  return {
    state: NoteState.Deleted,

    id: note.id,
    path: note.path,
    title: note.title,
    text: note.text,
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
  };
};

export const noteDeletedToRestoring = (note: NoteDeleted): NoteRestoring => {
  return {
    state: NoteState.Restoring,

    id: note.id,
    path: note.path,
    title: note.title,
    text: note.text,
  };
};

export const noteRestoringToLoaded = (note: NoteRestoring): NoteLoaded => {
  return {
    state: NoteState.Loaded,

    id: note.id,
    path: note.path,
    title: note.title,
    text: note.text,
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
  };
};

export const createNewNote = (id: number): NoteNew => {
  return {
    state: NoteState.New,

    id: "note_" + id.toString(),
  };
};

export const noteNewToCreating = (
  note: NoteNew,
  title: string,
  text: string
): NoteCreating => {
  return {
    state: NoteState.Creating,

    id: note.id,
    title,
    text,
  };
};

export const noteCreatingToFailedToCreate = (
  note: NoteCreating,
  err: string
): NoteFailedToCreate => {
  return {
    state: NoteState.FailedToCreate,

    id: note.id,
    title: note.title,
    text: note.text,

    err,
  };
};

export const noteFailedToCreateToCreating = (
  note: NoteFailedToCreate
): NoteCreating => {
  return {
    state: NoteState.Creating,

    id: note.id,
    title: note.title,
    text: note.text,
  };
};
