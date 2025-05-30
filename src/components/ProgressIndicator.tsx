import { memo } from "react";
import "./ProgressIndicator.css";

const ProgressIndicator = memo(function ProgressIndicator() {
  return (
    <div className="spinner">
      <div className="spinner-container container1">
        <div className="circle1"></div>
        <div className="circle2"></div>
        <div className="circle3"></div>
        <div className="circle4"></div>
      </div>
      <div className="spinner-container container2">
        <div className="circle1"></div>
        <div className="circle2"></div>
        <div className="circle3"></div>
        <div className="circle4"></div>
      </div>
      <div className="spinner-container container3">
        <div className="circle1"></div>
        <div className="circle2"></div>
        <div className="circle3"></div>
        <div className="circle4"></div>
      </div>
    </div>
  );
});

export default ProgressIndicator;
