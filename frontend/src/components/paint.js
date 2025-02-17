import React, { useRef, useState } from "react";
import { Stage, Layer, Line } from "react-konva";

const PaintApp = () => {
  const [lines, setLines] = useState([]);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const isDrawing = useRef(false);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { points: [pos.x, pos.y], color, brushSize }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    setLines([...lines.slice(0, -1), lastLine]);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <div className="container d-flex flex-column align-items-center p-4">
      <div className="mb-4 d-flex gap-3">
        <input type="color" className="form-control" value={color} onChange={(e) => setColor(e.target.value)} />
        <input
          type="number"
          className="form-control"
          min="1"
          max="20"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          placeholder="Brush Size"
        />
      </div>

      <Stage
        width={600}
        height={400}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        className="border"
      >
        <Layer>
          {lines.map((line, i) => (
            <Line key={i} points={line.points} stroke={line.color} strokeWidth={line.brushSize} lineCap="round" lineJoin="round" />
          ))}
        </Layer>
      </Stage>

      <div className="mt-4 d-flex gap-2">
        <button className="btn btn-danger" onClick={() => setLines([])}>Clear</button>
      </div>
    </div>
  );
};

export default PaintApp;
