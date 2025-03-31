import "./ClientArea.css";
import { AppEvent } from "../events";
import { Dispatch } from "../hooks/useReducer";
import { NoteListRetrieved } from "../model";
import NoteList from "./NoteList";
import EditorPanel from "./EditorPanel";

function ClientArea(props: {
  noteList: NoteListRetrieved;
  dispatch: Dispatch<AppEvent>;
}) {
  const noteList = props.noteList;
  const dispatch = props.dispatch;

  // TODO: review how I get to the selected note
  return (
    <div className="client-area">
      <NoteList
        notes={noteList.notes}
        selectedNoteId={noteList.selectedNoteId}
        dispatch={dispatch}
      />
      <EditorPanel
        note={noteList.notes.find((x) => x.id === noteList.selectedNoteId)}
        dispatch={dispatch}
      />
    </div>
  );
}

export default ClientArea;
