import { getTitleFromPath } from "./conversion";
import {
  NoteFailedToLoad,
  NoteLoaded,
  NoteLoading,
  NoteRef,
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
