import { memo } from "react";
import { OrbitProgress } from "react-loading-indicators";

const OrbitProgressIndicator = memo(function OrbitProgressIndicator() {
  return (
    <OrbitProgress
      variant="dotted"
      color="grey"
      style={{ fontSize: "2px" }}
      text=""
      textColor=""
    />
  );
});

export default OrbitProgressIndicator;
