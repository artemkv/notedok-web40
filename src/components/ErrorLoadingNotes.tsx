import "./ErrorLoadingNotes.css";
import { memo } from "react";

const ErrorLoadingNotes = memo(function ErrorLoadingNotes(props: {
  err: string;
}) {
  const err = props.err;

  return <div className="error-message">{err}</div>;
});

export default ErrorLoadingNotes;
