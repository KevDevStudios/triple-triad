import React from "react";
import PropTypes from "prop-types";
import MusicControl from "./components/MusicControl";

export default function StartScreen({
  onStart,
  onSelectDifficulty,
  difficulty,
  music,
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-950 via-blue-950 to-indigo-900 text-white font-sans transition-all duration-500 relative overflow-hidden">
      <MusicControl
        isPlaying={music.isPlaying}
        onToggle={music.toggleMusic}
        volume={music.volume}
        onVolumeChange={music.changeVolume}
        tracks={music.tracks}
        trackId={music.trackId}
        onTrackChange={music.changeTrack}
      />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="text-center space-y-8 z-10">
        <div className="space-y-2">
          <h1 className="text-6xl font-extrabold tracking-wider animate-pulse drop-shadow-2xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500">
            Triple Triad
          </h1>
          <p className="text-xl text-gray-300 font-semibold">The Ultimate Card Battle</p>
        </div>

        <div className="space-y-6 bg-black/40 p-8 rounded-2xl backdrop-blur-sm shadow-2xl border border-white/20">
          <div className="space-y-3">
            <label className="block text-lg font-medium text-yellow-300">
              Select Difficulty:
            </label>
            <select
              value={difficulty}
              onChange={(e) => onSelectDifficulty(e.target.value)}
              className="text-black rounded-lg px-6 py-3 bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500 font-semibold cursor-pointer w-full"
            >
              <option value="easy">🌟 Easy - Beginner Friendly</option>
              <option value="medium">⚡ Medium - Moderate Challenge</option>
              <option value="hard">🔥 Hard - Expert Level</option>
            </select>
          </div>

          <button
            onClick={onStart}
            className="mt-6 w-full px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-lg rounded-full shadow-2xl hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 hover:shadow-yellow-500/50"
          >
            🎮 Start Game
          </button>
        </div>

        <div className="mt-8 space-y-2 text-sm text-gray-400">
          <p>🎴 30 Unique Monster Cards</p>
          <p>🎵 Background Music & Sound Effects</p>
          <p>⚔️ Strategic Card Battles</p>
        </div>
      </div>

      <footer className="absolute bottom-4 text-center text-sm text-gray-400 z-10 space-y-1">
        <p>© 2025 Triple Triad Fan Project - Enhanced Edition</p>
        <p className="text-xs text-gray-500">
          Music: CC0 from OpenGameArt.org
        </p>
      </footer>
    </div>
  );
}

StartScreen.propTypes = {
  onStart: PropTypes.func.isRequired,
  onSelectDifficulty: PropTypes.func.isRequired,
  difficulty: PropTypes.string.isRequired,
  music: PropTypes.shape({
    isPlaying: PropTypes.bool.isRequired,
    toggleMusic: PropTypes.func.isRequired,
    volume: PropTypes.number.isRequired,
    changeVolume: PropTypes.func.isRequired,
    tracks: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        file: PropTypes.string.isRequired,
      })
    ).isRequired,
    trackId: PropTypes.string.isRequired,
    changeTrack: PropTypes.func.isRequired,
  }).isRequired,
};
