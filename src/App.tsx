import type React from "react";
import { useState } from "react";
import Palette from "./components/Palette";
import "./styles/App.css";

const generateRandomColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

const App: React.FC = () => {
  const [colors, setColors] = useState<string[]>(
    Array(5).fill("").map(generateRandomColor)
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const regenerateColors = () => {
    setColors(Array(5).fill("").map(generateRandomColor));
  };

  return (
    <div className="app">
      <Palette colors={colors} onColorClick={setSelectedColor} />
      <div className="controls">
        <button onClick={regenerateColors}>Generate New Palette</button>
        {selectedColor && (
          <div
            className="selected-color"
            style={{ backgroundColor: selectedColor }}
          />
        )}
      </div>
    </div>
  );
};

export default App;
