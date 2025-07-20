import React from "react";
import PropTypes from "prop-types";

export default function StartScreen({
  onStart,
  onSelectDifficulty,
  difficulty,
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-950 to-indigo-800 text-white font-sans transition-all duration-500">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-extrabold tracking-wider animate-pulse drop-shadow-lg">
          Triple Triad
        </h1>

        <div className="space-y-4">
          <label className="block text-lg font-medium">
            Select Difficulty:
          </label>
          <select
            value={difficulty}
            onChange={(e) => onSelectDifficulty(e.target.value)}
            className="text-black rounded px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <button
          onClick={onStart}
          className="mt-6 px-6 py-3 bg-yellow-400 text-black font-semibold rounded-full shadow-lg hover:bg-yellow-300 transition-all duration-300"
        >
          Start Game
        </button>
      </div>

      <footer className="absolute bottom-4 text-sm text-gray-300">
        © 2025 Triple Triad Fan Project
      </footer>
    </div>
  );
}

StartScreen.propTypes = {
  onStart: PropTypes.func.isRequired,
  onSelectDifficulty: PropTypes.func.isRequired,
  difficulty: PropTypes.string.isRequired,
};
