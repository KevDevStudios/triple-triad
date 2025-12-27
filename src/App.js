import React, { useState } from "react";
import StartScreen from "./StartScreen";
import Game from "./Game";
import useMusicPlayer from "./hooks/useMusicPlayer";

export default function App() {
  const [showGame, setShowGame] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  const mode = "PVE"; // Default to PVE for now
  const music = useMusicPlayer();

  return (
    <div className="min-h-screen">
      {!showGame ? (
        <StartScreen
          onStart={() => setShowGame(true)}
          onSelectDifficulty={setDifficulty}
          difficulty={difficulty}
          music={music}
        />
      ) : (
        <Game mode={mode} difficulty={difficulty} music={music} onBackToStart={() => setShowGame(false)} />
      )}
    </div>
  );
}
