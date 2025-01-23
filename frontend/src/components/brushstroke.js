import React, { useEffect, useState, useMemo } from 'react';

const BrushStrokeBehindText = ({
  text = 'Hello World',
  direction = 'leftToRight', // or 'rightToLeft'
  strokeWidth = 50, // Thicker stroke for a prominent look
  animationDuration = 2,
  fontSize = 24,
  fontFamily = 'Arial', // Default font family
  paddingX = 50, // Padding on the left and right
  paddingY = 30, // Padding on the top and bottom
  onColorGenerated,
}) => {
  const [textWidth, setTextWidth] = useState(300); // Default width for the text
  const [textHeight, setTextHeight] = useState(fontSize); // Height based on font size

  // Generate random stroke color on mount
  const strokeColor = useMemo(() => {
    // Generate a random color
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    
    // Validate that the randomColor is a valid hex color, otherwise use a fallback
    const isValidColor = /^#[0-9A-F]{6}$/i.test(randomColor);
    return isValidColor ? randomColor : "#FF5733"; // Default color is Vibrant Orange
  }, []);
  
  useEffect(() => {
    if (onColorGenerated) {
      onColorGenerated(strokeColor); // Send the color to the parent once
    }
  }, [strokeColor, onColorGenerated]);
  

  // Measure the text width dynamically
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = `${fontSize}px ${fontFamily}`;
    const measuredWidth = context.measureText(text).width;
    setTextWidth(measuredWidth);
    setTextHeight(fontSize * 1.2); // Adjust height for line spacing
  }, [text, fontSize, fontFamily]);

  // Define the path shape
  const getPathDefinition = () => {
    if (direction === 'leftToRight') {
      return `M0,${textHeight / 2 + paddingY} 
              C${textWidth / 4},${textHeight / 4} 
              ${textWidth * (3 / 4)},${textHeight * 1.5} 
              ${textWidth + paddingX * 2},${textHeight / 2 + paddingY}`;
    } else {
      return `M${textWidth + paddingX * 2},${textHeight / 2 + paddingY} 
              C${textWidth * (3 / 4)},${textHeight * 1.5} 
              ${textWidth / 4},${textHeight / 4} 
              0,${textHeight / 2 + paddingY}`;
    }
  };

  return (
    <svg
      width={textWidth + paddingX * 2}
      height={textHeight + paddingY * 2}
      viewBox={`0 0 ${textWidth + paddingX * 2} ${textHeight + paddingY * 2}`}
      style={{ display: 'block' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Brush Stroke Path */}
      <path
        d={getPathDefinition()}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
        style={{
          strokeDasharray: textWidth + paddingX * 2,
          strokeDashoffset: textWidth + paddingX * 2,
          animation: `drawStroke ${animationDuration}s ease forwards`,
        }}
      />
      <defs>
        <filter id="shadow">
        <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="black" />
        </filter>
    </defs>

      {/* Text positioned in the center */}
      <text
        x="50%"
        y="40%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize={fontSize}
        fontFamily={fontFamily}
        fill="white"
        filter="url(#shadow)"
      >
        {text}
      </text>

      {/* Keyframe animation for the stroke */}
      <style>
        {`
          @keyframes drawStroke {
            to {
              stroke-dashoffset: 0;
            }
          }
        `}
      </style>
    </svg>
  );
};

export default BrushStrokeBehindText;
