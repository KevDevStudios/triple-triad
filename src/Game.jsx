// Game.jsx
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import useGameLogic from "./hooks/useGameLogic";
import useMusicPlayer from "./hooks/useMusicPlayer";
import useGameRecorder from "./hooks/useGameRecorder";
import GameBoard from "./components/GameBoard";
import MusicControl from "./components/MusicControl";
import PlayerHand from "./components/PlayerHand";
import Confetti from "./components/Confetti";
import RecordingControls from "./components/RecordingControls";

export default function Game({ mode, difficulty }) {
  const {
    board,
    turn,
    scores,
    message,
    flipMap,
    hands,
    handleCellClick,
    resetGame,
    moveInProgress,
    initializeWithStarter,
  } = useGameLogic({ mode, difficulty });

  const { isPlaying, toggleMusic, volume, changeVolume } = useMusicPlayer();
  const {
    isRecording,
    hasRecording,
    startRecording,
    stopRecording,
    downloadRecording,
  } = useGameRecorder();

  const [showCoinFlip, setShowCoinFlip] = useState(true);
  const [coinFace, setCoinFace] = useState("🪙");
  const [isFlipping, setIsFlipping] = useState(false);

  const startWithCoinFlip = () => {
    setCoinFace("🪙"); // reset immediately
    setIsFlipping(true);
    setShowCoinFlip(true);

    setTimeout(() => {
      const faces = ["🪙 Heads", "🪙 Tails"];
      const randomIndex = Math.floor(Math.random() * faces.length);
      const result = faces[randomIndex];
      const starter = randomIndex === 0 ? "P1" : "P2";
      setCoinFace(result);
      initializeWithStarter(starter);
      setIsFlipping(false);
    }, 1500);

    setTimeout(() => setShowCoinFlip(false), 3000);
  };

  useEffect(() => {
    startWithCoinFlip();
    // Only run once on mount to initialize the game
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const guardedClick = (r, c) => {
    if (showCoinFlip || moveInProgress || (mode === "PVE" && turn === "P2"))
      return;
    handleCellClick(r, c);
  };

  const isGameOver =
    (!turn && message.toLowerCase().includes("wins")) ||
    message.toLowerCase().includes("tie");

  const handleRestart = () => {
    resetGame();
    startWithCoinFlip();
  };

  return (
    <div className="p-4 text-white relative">
      <RecordingControls
        isRecording={isRecording}
        hasRecording={hasRecording}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        onDownloadRecording={downloadRecording}
      />
      
      <MusicControl 
        isPlaying={isPlaying} 
        onToggle={toggleMusic} 
        volume={volume}
        onVolumeChange={changeVolume}
      />

      <PlayerHand cards={hands.P1} player="P1" isActive={turn === "P1"} />
      <PlayerHand cards={hands.P2} player="P2" isActive={turn === "P2"} />
      
      {showCoinFlip && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div
            className={`w-32 h-32 rounded-full border-4 border-yellow-300 flex items-center justify-center text-xl font-bold text-yellow-300 text-center transition-transform duration-700 ${
              isFlipping ? "animate-flip" : ""
            }`}
          >
            {coinFace}
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-900/80 via-purple-900/80 to-indigo-900/80 text-white rounded-xl p-4 text-center text-xl font-bold mb-6 shadow-2xl backdrop-blur-sm border-2 border-white/20">
        <div className="flex justify-around items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔵</span>
            <span>Player 1: <span className="text-blue-300">{scores.P1}</span></span>
          </div>
          <div className="text-yellow-300">VS</div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔴</span>
            <span>Player 2: <span className="text-red-300">{scores.P2}</span></span>
          </div>
        </div>
      </div>
      <div className="text-xl mb-6 text-center font-semibold bg-black/50 rounded-lg py-2 px-4 inline-block mx-auto block">{message}</div>

      <GameBoard board={board} flipMap={flipMap} onCellClick={guardedClick} />

      {isGameOver && (
        <>
          <Confetti />
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-purple-800 to-indigo-900 text-white p-8 rounded-2xl shadow-2xl text-center space-y-6 border-4 border-yellow-400 max-w-md">
              <h2 className="text-4xl font-bold animate-pulse">{message}</h2>
              <div className="text-6xl">
                {message.includes("Player 1") ? "🏆" : message.includes("Player 2") ? "🎖️" : "🤝"}
              </div>
              <div className="text-xl">
                Final Score: {scores.P1} - {scores.P2}
              </div>
              <button
                onClick={handleRestart}
                className="mt-4 w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-bold py-3 px-6 rounded-full text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                🎮 Play Again
              </button>
            </div>
          </div>
        </>
      )}

      <div className="text-center mt-4">
        <button
          onClick={handleRestart}
          className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-black font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          🔄 Restart Game
        </button>
      </div>
    </div>
  );
}

Game.propTypes = {
  mode: PropTypes.oneOf(["PVE", "PVP"]).isRequired,
  difficulty: PropTypes.oneOf(["easy", "medium", "hard"]).isRequired,
};
