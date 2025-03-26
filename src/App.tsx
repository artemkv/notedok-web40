import "./App.css";
import CognitoSignin from "./components/CognitoSignIn";
import { AppEvent } from "./events";
import { Dispatch } from "./hooks/useReducer";
import { AppState, AuthenticationStatus } from "./model";

function App(props: { state: AppState; dispatch: Dispatch<AppEvent> }) {
  const state = props.state;
  const dispatch = props.dispatch;

  if (state.auth === AuthenticationStatus.Unauthenticated) {
    return <CognitoSignin dispatch={dispatch} />;
  }

  return <p>{state.todo}</p>;
}

export default App;
