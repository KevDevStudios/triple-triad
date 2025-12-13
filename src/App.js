import React, { useState } from "react";
import StartScreen from "./StartScreen";
import Game from "./Game";

export default function App() {
  const [showGame, setShowGame] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  const mode = "PVE"; // Default to PVE for now

  return (
    <div className="min-h-screen">
      {!showGame ? (
        <StartScreen
          onStart={() => setShowGame(true)}
          onSelectDifficulty={setDifficulty}
          difficulty={difficulty}
        />
      ) : (
        <Game mode={mode} difficulty={difficulty} />
      )}
    </div>
  );
}
