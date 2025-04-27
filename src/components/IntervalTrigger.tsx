import { memo, useEffect } from "react";

const SAVE_DRAFT_INTERVAL = 5000;

const IntervalTrigger = memo(function OrbitProgressIndicator(props: {
  callback: () => void;
}) {
  const callback = props.callback;

  useEffect(() => {
    const intervalId = setInterval(() => callback(), SAVE_DRAFT_INTERVAL);
    return () => {
      clearInterval(intervalId);
    };
  }, [callback]);

  return <></>;
});

export default IntervalTrigger;
