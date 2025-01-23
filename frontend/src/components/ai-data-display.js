import React, { useState } from "react";
import BrushStrokeBehindText from "./brushstroke";
import splat from "../images/paints/splat.svg";

export default function AIDataDisplay({ data, title, description }) {
  const [backgroundColor, setBackgroundColor] = useState(null);
  const randomTilt = Math.random() > 0.5 ? -10 : 10;

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="d-flex flex-column align-items-center text-center position-relative">
      {/* Brush Stroke Behind Title */}
      <div className="position-relative">
        <BrushStrokeBehindText
          text={title}
          direction="rightToLeft"
          onColorGenerated={(color) => setBackgroundColor(color)}
        />
      </div>

      {/* Splat Masked Div */}
      <div
        className="d-flex flex-column justify-content-center align-items-center position-relative"
        style={{
          width: "400px",
          height: "400px",
          background: `${backgroundColor || "black"}`, // Fallback color
          color: "white",
          backgroundImage: `url(${splat})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "80%", // Ensures the splat fits within the div
          backgroundPosition: "center", // Centers the SVG in the div
          maskImage: `url(${splat})`,
          WebkitMaskImage: `url(${splat})`, // For WebKit browsers
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskPosition: "center",
          WebkitMaskPosition: "center",
          transform: `rotate(${randomTilt}deg)`,
        }}
      >
        <h3 className="mt-3 fw-bold" style={{textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)"}}>{data}</h3>
      </div>
      {description && (
        <p
          className="position-absolute p-2 rounded"
          style={{
            top: "70%", // Adjust the vertical position
            left: "50%", // Center horizontally
            transform: `translate(-50%, -50%) rotate(${randomTilt}deg)`, // Center and rotate
            backgroundColor: "rgba(18, 217, 21, .9)", // Semi-transparent background
            color: "white", 
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            width: "300px",
            textAlign: "center",
            zIndex: 2,
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
