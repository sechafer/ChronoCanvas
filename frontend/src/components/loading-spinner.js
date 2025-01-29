import React from "react";
import spinnerGif from "../images/spinner.gif";

export default function LoadingSpinner() {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent white background
        zIndex: 9999, // Ensure it appears above other content
      }}
    >
      <img
        src={spinnerGif}
        alt="Loading..."
      />
    </div>
  );
}
