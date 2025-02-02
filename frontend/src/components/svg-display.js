import React, {useState} from "react";
import BrushStrokeBehindText from "./brushstroke";


export default function SvgDisplay({
  id, // Accept id as a prop
  image,
  title,
  imgDescription,
  descriptionStyle = {},
}) {
    const rawSvg = image;
    const cleanedSvgString = rawSvg?.replace(/\\/g, "").replace(/\n/g, "");
    console.log(cleanedSvgString);
    const [backgroundColor, setBackgroundColor] = useState(null);

  const defaultDescriptionStyle = {
    fontSize: "12px",
    top: "80%", // Default vertical position
    backgroundColor: "#ffffff", // Semi-transparent background
    color: "rgb(29, 9, 89)",
    width: "90%",
    textAlign: "center",
    zIndex: 2,
  };

  return (
    <div
      className="d-flex flex-column align-items-center text-center position-relative"
    >
      {/* Brush Stroke Behind Title */}
      <div className="position-relative">
        <BrushStrokeBehindText
          text={title}
          direction="rightToLeft"
          onColorGenerated={(color) => setBackgroundColor(color)}
        />
      </div>

      <div
        className="d-flex flex-column justify-content-center align-items-center position-relative"
        dangerouslySetInnerHTML={{ __html: cleanedSvgString }}
      />

      {/* Description Positioned Separately */}
      {imgDescription && (
        <p
          className="position-absolute p-2 rounded"
          style={{
            ...defaultDescriptionStyle, // Apply default styles
            ...descriptionStyle, // Override with custom styles (if provided)
          }}
        >
          {imgDescription}
        </p>
      )}
    </div>
  );
}





