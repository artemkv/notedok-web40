import "./SearchPanel.css";
import SearchIcon from "../assets/search.svg";
import CloseIcon from "../assets/close.svg";
import { AppEvent, EventType } from "../events";
import { Dispatch } from "../hooks/useReducer";
import uistrings from "../uistrings";
import { memo } from "react";

const SearchPanel = memo(function SearchPanel(props: {
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

  const onCloseClick = () => {
    dispatch({
      type: EventType.SearchTextUpdated,
      searchText: "",
    });
  };

  return (
    <div className="search-panel">
      <div className="search-panel-input-container">
        <img src={SearchIcon} />
        <input
          id="search_textbox"
          type="text"
          value={searchText}
          onChange={onChange}
          onKeyUp={onKeyUp}
          className="search-textbox"
          placeholder={uistrings.SearchTextBoxPlaceholder}
        />
        <img
          className="search-panel-icon-close"
          src={CloseIcon}
          onClick={onCloseClick}
        />
      </div>
    </div>
  );
});

export default SearchPanel;
