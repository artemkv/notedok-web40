import "./ClientArea.css";
import { AppEvent } from "../events";
import { Dispatch } from "../hooks/useReducer";
import { NoteListRetrieved } from "../model";
import NoteList from "./NoteList";
import EditorPanel from "./EditorPanel";
import SearchPanel from "./SearchPanel";

function ClientArea(props: {
  noteList: NoteListRetrieved;
  dispatch: Dispatch<AppEvent>;
}) {
  const noteList = props.noteList;
  const dispatch = props.dispatch;

  // TODO: review how I get to the selected note
  return (
    <div className="client-area">
      <div className="client-area-left">
        <SearchPanel searchText={noteList.searchText} dispatch={dispatch} />
        <NoteList
          notes={noteList.notes}
          searchText={noteList.searchText}
          selectedNoteId={noteList.selectedNoteId}
          dispatch={dispatch}
        />
      </div>
      <div className="client-area-right">
        <EditorPanel
          note={noteList.notes.find((x) => x.id === noteList.selectedNoteId)}
          dispatch={dispatch}
        />
      </div>
    </div>
  );
}

export default ClientArea;
