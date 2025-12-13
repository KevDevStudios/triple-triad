import React from 'react';
import PropTypes from 'prop-types';

export default function MusicControl({ isPlaying, onToggle, volume, onVolumeChange }) {
  return (
    <div className="fixed top-4 right-4 z-40 flex items-center gap-2 bg-black/70 p-3 rounded-lg shadow-lg backdrop-blur-sm">
      <button
        onClick={onToggle}
        className="text-2xl hover:scale-110 transition-transform"
        title={isPlaying ? 'Mute Music' : 'Play Music'}
      >
        {isPlaying ? '🔊' : '🔇'}
      </button>
      <input
        type="range"
        min="0"
        max="100"
        value={volume * 100}
        onChange={(e) => onVolumeChange(e.target.value / 100)}
        className="w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
        title="Volume"
      />
    </div>
  );
}

MusicControl.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  volume: PropTypes.number.isRequired,
  onVolumeChange: PropTypes.func.isRequired,
};
