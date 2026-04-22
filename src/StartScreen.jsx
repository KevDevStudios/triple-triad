import React from "react";
import PropTypes from "prop-types";
import MusicControl from "./components/MusicControl";
import { GAME_MODES } from "./gameModes";

const DIFFICULTIES = [
  { id: "easy", label: "Easy", emoji: "🌟", desc: "Beginner friendly" },
  { id: "medium", label: "Medium", emoji: "⚡", desc: "Moderate challenge" },
  { id: "hard", label: "Hard", emoji: "🔥", desc: "Expert level" },
];

export default function StartScreen({
  onStart,
  onSelectDifficulty,
  difficulty,
  gameMode,
  onSelectGameMode,
  music,
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-950 via-blue-950 to-indigo-900 text-white font-sans transition-all duration-500 relative overflow-hidden px-4 py-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Music control docked top-right with safe padding */}
      <div className="fixed top-4 right-4 z-40">
        <MusicControl
          isPlaying={music.isPlaying}
          onToggle={music.toggleMusic}
          volume={music.volume}
          onVolumeChange={music.changeVolume}
          tracks={music.tracks}
          trackId={music.trackId}
          onTrackChange={music.changeTrack}
          containerClassName="w-[260px] sm:w-[280px] rounded-2xl border border-white/15 bg-gradient-to-br from-purple-900/85 to-indigo-900/85 shadow-xl backdrop-blur-md"
        />
      </div>

      <div className="text-center space-y-8 z-10 w-full max-w-md">
        <div className="space-y-2">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-wider drop-shadow-2xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500">
            Triple Triad
          </h1>
          <p className="text-base sm:text-lg text-gray-300 font-semibold">The Ultimate Card Battle</p>
        </div>

        <div className="space-y-6 bg-black/40 p-6 sm:p-8 rounded-2xl backdrop-blur-sm shadow-2xl border border-white/15">
          <div className="space-y-3 text-left">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-yellow-300 uppercase tracking-wide">
                Difficulty
              </label>
              <span className="text-xs text-white/60">
                {DIFFICULTIES.find((d) => d.id === difficulty)?.desc}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTIES.map((d) => {
                const active = difficulty === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => onSelectDifficulty(d.id)}
                    aria-pressed={active}
                    className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 transition-all duration-200 font-semibold text-sm
                      ${active
                        ? 'bg-gradient-to-br from-yellow-400/90 to-orange-500/90 text-black border-white/30 shadow-lg scale-[1.02]'
                        : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10 hover:border-white/25'}`}
                  >
                    <span className="text-xl" aria-hidden>{d.emoji}</span>
                    <span>{d.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 text-left">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-yellow-300 uppercase tracking-wide">
                Game Mode
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {GAME_MODES.map((m) => {
                const active = gameMode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onSelectGameMode(m.id)}
                    aria-pressed={active}
                    className={`group relative flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border-2 transition-all duration-200 font-semibold text-xs
                      ${active
                        ? 'bg-gradient-to-br from-pink-500/90 to-purple-600/90 text-white border-white/30 shadow-lg scale-[1.02]'
                        : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10 hover:border-white/25'}`}
                  >
                    <span className="text-lg" aria-hidden>{m.emoji}</span>
                    <span>{m.label}</span>
                    {/* Tooltip */}
                    <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 rounded-xl bg-gray-900/95 border border-white/15 px-3 py-2 text-[11px] text-white/90 font-normal leading-snug shadow-xl opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150 z-50 text-center">
                      <span className="block font-bold mb-0.5">{m.emoji} {m.label}</span>
                      {m.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={onStart}
            className="w-full px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-lg rounded-full shadow-2xl hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-yellow-500/50 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300/50"
          >
            🎮 Start Game
          </button>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2 text-xs text-gray-300">
          <div className="bg-white/5 border border-white/10 rounded-lg py-2 px-1">
            <div className="text-lg" aria-hidden>🎴</div>
            <div className="mt-1">30 Cards</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg py-2 px-1">
            <div className="text-lg" aria-hidden>🎵</div>
            <div className="mt-1">Music & SFX</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg py-2 px-1">
            <div className="text-lg" aria-hidden>⚔️</div>
            <div className="mt-1">Strategy</div>
          </div>
        </div>
      </div>

      <footer className="relative mt-6 text-center text-xs text-gray-400 z-10 space-y-1 px-4">
        <p>© 2025 Triple Triad Fan Project — Enhanced Edition</p>
        <p className="text-[10px] text-gray-500">
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
  gameMode: PropTypes.string.isRequired,
  onSelectGameMode: PropTypes.func.isRequired,
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
