import "./NoteListFilter.css";
import { AppEvent, EventType } from "../events";
import { Dispatch } from "../hooks/useReducer";
import { memo } from "react";
import { SortingOrder } from "../model";

const NoteListControlPanel = memo(function NoteList(props: {
  sortingOrder: SortingOrder;
  dispatch: Dispatch<AppEvent>;
}) {
  const sortingOrder = props.sortingOrder;
  const dispatch = props.dispatch;

  const onSwitchToAlphabetic = () => {
    dispatch({
      type: EventType.SortingOrderUpdated,
      sortingOrder: SortingOrder.Alphabetic,
    });
  };

  const onSwitchToMostRecentFirst = () => {
    dispatch({
      type: EventType.SortingOrderUpdated,
      sortingOrder: SortingOrder.MostRecentFirst,
    });
  };

  if (sortingOrder == SortingOrder.Alphabetic) {
    return (
      <div className="filter-switch">
        <span className="filter-switch-text">ABC</span>
        <span className="filter-switch-separator">|</span>
        <button
          className="filter-switch-button"
          onClick={onSwitchToMostRecentFirst}
        >
          MM-DD
        </button>
      </div>
    );
  } else {
    return (
      <div className="filter-switch">
        <button className="filter-switch-button" onClick={onSwitchToAlphabetic}>
          ABC
        </button>
        <span className="filter-switch-separator">|</span>
        <span className="filter-switch-text">MM-DD</span>
      </div>
    );
  }
});

export default NoteListControlPanel;
