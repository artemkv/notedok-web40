import uistrings from "../uistrings";
import "./FormatSwitch.css";
import { memo } from "react";

const FormatSwitch = memo(function FormatSwitch(props: {
  isMarkdown: boolean;
  onFormatSwitch: (isMarkdown: boolean) => void;
}) {
  const isMarkdown = props.isMarkdown;
  const onFormatSwitch = props.onFormatSwitch;

  const onSwitchToTextClick = () => {
    onFormatSwitch(false);
  };

  const onSwitchToMarkdownClick = () => {
    onFormatSwitch(true);
  };

  return isMarkdown ? (
    <span className="format-switch">
      [
      <span className="format-switch-text">
        {uistrings.AsMarkdownButtonText}
      </span>
      |
      <button className="format-switch-button" onClick={onSwitchToTextClick}>
        {uistrings.AsTextButtonText}
      </button>
      ]
    </span>
  ) : (
    <span className="format-switch">
      [
      <button
        className="format-switch-button"
        onClick={onSwitchToMarkdownClick}
      >
        {uistrings.AsMarkdownButtonText}
      </button>
      |<span className="format-switch-text">{uistrings.AsTextButtonText}</span>]
    </span>
  );
});

export default FormatSwitch;
