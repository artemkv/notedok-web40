import useReducer from "./hooks/useReducer";
import { IntialState } from "./model";
import App from "./App";
import { Reducer } from "./reducer";
import { InitialCommand } from "./commands";

function AppStatefulContainer() {
  const [state, dispatch] = useReducer(Reducer, IntialState, InitialCommand);

  return <App state={state} dispatch={dispatch} />;
}

export default AppStatefulContainer;
