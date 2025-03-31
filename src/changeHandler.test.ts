import { Change, ChangeType, pushWithDedup } from "./changeHandler";

const CHANGE_NOTE_1_1: Change = {
  type: ChangeType.Save,
  noteId: "note1",
  newTitle: "newTitle1.1",
  newText: "newText1.1",
  onSuccess: () => {},
  onFailure: () => {},
};

const CHANGE_NOTE_1_2: Change = {
  type: ChangeType.Save,
  noteId: "note1",
  newTitle: "newTitle1.2",
  newText: "newText1.2",
  onSuccess: () => {},
  onFailure: () => {},
};

const CHANGE_NOTE_2: Change = {
  type: ChangeType.Save,
  noteId: "note2",
  newTitle: "newTitle2",
  newText: "newText2",
  onSuccess: () => {},
  onFailure: () => {},
};

const CHANGE_NOTE_3: Change = {
  type: ChangeType.Save,
  noteId: "note3",
  newTitle: "newTitle3",
  newText: "newText3",
  onSuccess: () => {},
  onFailure: () => {},
};

test("no dedup adds the change on the queue", () => {
  const q: Change[] = [CHANGE_NOTE_1_1, CHANGE_NOTE_2];

  const qActual = pushWithDedup(q, CHANGE_NOTE_3);
  const qExpected = [CHANGE_NOTE_1_1, CHANGE_NOTE_2, CHANGE_NOTE_3];

  expect(qActual).toEqual(qExpected);
});

test("dedup first element", () => {
  const q: Change[] = [CHANGE_NOTE_1_1, CHANGE_NOTE_2];

  const qActual = pushWithDedup(q, CHANGE_NOTE_1_2);
  const qExpected = [CHANGE_NOTE_1_2, CHANGE_NOTE_2];

  expect(qActual).toEqual(qExpected);
});

test("dedup last element", () => {
  const q: Change[] = [CHANGE_NOTE_2, CHANGE_NOTE_1_1];

  const qActual = pushWithDedup(q, CHANGE_NOTE_1_2);
  const qExpected = [CHANGE_NOTE_2, CHANGE_NOTE_1_2];

  expect(qActual).toEqual(qExpected);
});
