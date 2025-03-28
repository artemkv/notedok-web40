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

  return (
    <div className="client-area">
      <NoteList
        notes={noteList.notes}
        selectedNote={noteList.selectedNote}
        dispatch={dispatch}
      />
      <EditorPanel />
    </div>
  );
}

export default ClientArea;
