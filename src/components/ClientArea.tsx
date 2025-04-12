import "./ClientArea.css";
import { AppEvent } from "../events";
import { Dispatch } from "../hooks/useReducer";
import { NoteListRetrieved } from "../model";
import NoteList from "./NoteList";
import EditorPanel from "./EditorPanel";
import SearchPanel from "./SearchPanel";
import { filter } from "../buisiness";

function ClientArea(props: {
  noteList: NoteListRetrieved;
  dispatch: Dispatch<AppEvent>;
}) {
  const noteList = props.noteList;
  const dispatch = props.dispatch;

  const selectedNote = noteList.notes.find(
    (x) => x.id === noteList.selectedNoteId
  );

  return (
    <div className="client-area">
      <div className="client-area-left">
        <SearchPanel searchText={noteList.searchText} dispatch={dispatch} />
        <NoteList
          notes={noteList.notes}
          filteredNotes={filter(noteList.notes, noteList.searchText)}
          selectedNoteId={noteList.selectedNoteId}
          dispatch={dispatch}
        />
      </div>
      <div className="client-area-right">
        <EditorPanel
          note={selectedNote}
          editor={noteList.editor}
          dispatch={dispatch}
        />
      </div>
    </div>
  );
}

export default ClientArea;
