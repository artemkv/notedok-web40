import "./App.css";
import CognitoSignin from "./components/CognitoSignIn";
import ProgressIndicator from "./components/ProgressIndicator";
import { AppEvent } from "./events";
import { Dispatch } from "./hooks/useReducer";
import { AppState, AuthenticationStatus, FileListState } from "./model";

function App(props: { state: AppState; dispatch: Dispatch<AppEvent> }) {
  const state = props.state;
  const dispatch = props.dispatch;

  if (state.auth === AuthenticationStatus.Unauthenticated) {
    return <CognitoSignin dispatch={dispatch} />;
  }

  if (state.fileList.state == FileListState.Retrieving) {
    return <ProgressIndicator />;
  }

  return (
    <div>
      {state.fileList.files.map((f) => (
        <div key={f}>{f}</div>
      ))}
    </div>
  );
}

export default App;
