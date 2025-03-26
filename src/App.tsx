import "./App.css";
import CognitoSignin from "./components/CognitoSignIn";
import ProgressIndicator from "./components/ProgressIndicator";
import { AppEvent } from "./events";
import { Dispatch } from "./hooks/useReducer";
import { AppState, AuthenticationStatus, NoteListState } from "./model";

function App(props: { state: AppState; dispatch: Dispatch<AppEvent> }) {
  const state = props.state;
  const dispatch = props.dispatch;

  if (state.auth === AuthenticationStatus.Unauthenticated) {
    return <CognitoSignin dispatch={dispatch} />;
  }

  if (state.noteList.state == NoteListState.Retrieving) {
    return <ProgressIndicator />;
  }

  return (
    <div>
      {state.noteList.notes.map((note) => (
        <div key={note.path}>{note.title}</div>
      ))}
    </div>
  );
}

export default App;
