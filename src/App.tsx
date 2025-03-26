import "./App.css";
import { AppEvent } from "./events";
import { Dispatch } from "./hooks/useReducer";
import { AppState } from "./model";

function App(props: { state: AppState; dispatch: Dispatch<AppEvent> }) {
  const state = props.state;
  // const dispatch = props.dispatch;

  return <p>{state}</p>;
}

export default App;
