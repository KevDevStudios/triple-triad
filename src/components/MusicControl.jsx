import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';

export default function MusicControl({
  isPlaying,
  onToggle,
  volume,
  onVolumeChange,
  tracks,
  trackId,
  onTrackChange,
  containerClassName,
}) {
  const [isTrackMenuOpen, setIsTrackMenuOpen] = useState(false);
  const trackMenuRef = useRef(null);

  const currentTrackName = useMemo(() => {
    if (!Array.isArray(tracks) || tracks.length === 0) return 'Track';
    const current = tracks.find((t) => t.id === trackId);
    return current?.name || tracks[0]?.name || 'Track';
  }, [tracks, trackId]);

  useEffect(() => {
    if (!isTrackMenuOpen) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsTrackMenuOpen(false);
    };
    const onPointerDown = (e) => {
      const root = trackMenuRef.current;
      if (!root) return;
      if (!root.contains(e.target)) setIsTrackMenuOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [isTrackMenuOpen]);

  return (
    <div
      className={
        containerClassName ||
        "fixed top-4 right-4 z-40 w-[280px] rounded-2xl border border-white/15 bg-gradient-to-br from-purple-900/80 to-indigo-900/80 shadow-xl backdrop-blur-md"
      }
    >
      <div className="px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="text-xs font-bold text-white/80 uppercase tracking-wide">Music</div>
          <div className="flex-1" />
          <div className="text-[11px] text-white/70">{isPlaying ? 'Playing' : 'Muted'}</div>
        </div>

        <div className="mt-2 flex items-center gap-2">
        <button
          onClick={onToggle}
          className="text-2xl hover:scale-110 transition-transform"
          title={isPlaying ? 'Mute Music' : 'Play Music'}
        >
          {isPlaying ? '🔊' : '🔇'}
        </button>

          {Array.isArray(tracks) && tracks.length > 0 && trackId && onTrackChange ? (
            <div className="relative flex-1 min-w-0" ref={trackMenuRef}>
              <button
                type="button"
                onClick={() => setIsTrackMenuOpen((v) => !v)}
                className="w-full flex items-center gap-2 bg-black/35 text-white text-sm rounded-xl px-3 py-2 border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20"
                title="Background music track"
              >
                <span aria-hidden className="text-white/70 text-xs">♪</span>
                <span className="truncate">{currentTrackName}</span>
              </button>

              {isTrackMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-full rounded-xl border border-white/15 bg-black/80 backdrop-blur-md shadow-2xl overflow-hidden">
                  <div className="max-h-56 overflow-auto">
                    {tracks.map((t) => {
                      const isActive = t.id === trackId;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            onTrackChange(t.id);
                            setIsTrackMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                            isActive
                              ? 'bg-white/15 text-white'
                              : 'text-white/90 hover:bg-white/10'
                          }`}
                        >
                          <span className="block truncate">{t.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1" />
          )}
        </div>

      <div className="mt-2 flex items-center gap-2">
        <input
          type="range"
          min="0"
          max="100"
          value={volume * 100}
          onChange={(e) => onVolumeChange(e.target.value / 100)}
          className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          title="Volume"
        />
        <span className="text-xs text-white/70 w-10 text-right">{Math.round(volume * 100)}%</span>
      </div>
      </div>
    </div>
  );
}

MusicControl.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  volume: PropTypes.number.isRequired,
  onVolumeChange: PropTypes.func.isRequired,
  tracks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      file: PropTypes.string.isRequired,
    })
  ),
  trackId: PropTypes.string,
  onTrackChange: PropTypes.func,
  containerClassName: PropTypes.string,
};
