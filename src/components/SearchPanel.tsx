import "./SearchPanel.css";
import { AppEvent, EventType } from "../events";
import { Dispatch } from "../hooks/useReducer";
import uistrings from "../uistrings";

function SearchPanel(props: {
  searchText: string;
  dispatch: Dispatch<AppEvent>;
}) {
  const searchText = props.searchText;
  const dispatch = props.dispatch;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: EventType.SearchTextUpdated,
      searchText: e.target.value,
    });
  };

  const onKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      dispatch({
        type: EventType.SearchTextUpdated,
        searchText: "",
      });
    }
  };

  return (
    <div className="search-panel">
      <input
        id="search_textbox"
        type="text"
        value={searchText}
        onChange={onChange}
        onKeyUp={onKeyUp}
        className="search-textbox"
        placeholder={uistrings.SearchTextBoxPlaceholder}
      />
    </div>
  );
}

export default SearchPanel;
