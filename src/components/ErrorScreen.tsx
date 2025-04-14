import "./ErrorScreen.css";
import { memo } from "react";

const ErrorScreen = memo(function ErrorScreen(props: { err: string }) {
  const err = props.err;

  return <div className="error-message">{err}</div>;
});

export default ErrorScreen;
