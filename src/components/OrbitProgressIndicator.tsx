import { OrbitProgress } from "react-loading-indicators";

const OrbitProgressIndicator = function OrbitProgressIndicator() {
  return (
    <OrbitProgress
      variant="dotted"
      color="grey"
      style={{ fontSize: "2px" }}
      text=""
      textColor=""
    />
  );
};

export default OrbitProgressIndicator;
