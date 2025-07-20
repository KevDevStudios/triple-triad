// Game.jsx
import React from "react";
import PropTypes from "prop-types";
import useGameLogic from "./hooks/useGameLogic";
import GameBoard from "./components/GameBoard";

export default function Game({ mode, difficulty }) {
  const {
    board,
    turn,
    scores,
    message,
    flipMap,
    handleCellClick,
    resetGame,
    moveInProgress,
  } = useGameLogic({ mode, difficulty });

  const guardedClick = (r, c) => {
    if (moveInProgress || (mode === "PVE" && turn === "P2")) return;
    handleCellClick(r, c);
  };

  const isGameOver =
    (!turn && message.toLowerCase().includes("wins")) ||
    message.toLowerCase().includes("tie");

  return (
    <div className="p-4 text-white">
      <div className="bg-black/60 text-white rounded-lg p-2 text-center text-lg font-bold mb-4 shadow-md">
        Score: Player 1 — {scores.P1} | Player 2 — {scores.P2}
      </div>
      <div className="text-lg mb-4 text-center">{message}</div>

      <GameBoard board={board} flipMap={flipMap} onCellClick={guardedClick} />

      {isGameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-xl shadow-lg text-center space-y-4">
            <h2 className="text-2xl font-bold">{message}</h2>
            <button
              onClick={resetGame}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={resetGame}
          className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
        >
          Restart Game
        </button>
      </div>
    </div>
  );
}

Game.propTypes = {
  mode: PropTypes.oneOf(["PVE", "PVP"]).isRequired,
  difficulty: PropTypes.oneOf(["easy", "medium", "hard"]).isRequired,
};
