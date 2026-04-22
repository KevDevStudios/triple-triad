import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function OptionsMenu({ 
  onRestart,
  onBackToStart
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className={`backdrop-blur-md text-white font-bold py-2 px-3 rounded-xl shadow-lg border-2 transition-all duration-200 ${
          isOpen
            ? 'bg-gradient-to-br from-purple-600 to-indigo-700 border-white/40'
            : 'bg-gradient-to-br from-purple-800/90 to-indigo-900/90 border-white/15 hover:border-white/40 hover:scale-105'
        }`}
      >
        <span className="inline-flex items-center gap-2">
          <span aria-hidden>⚙️</span>
          <span className="hidden sm:inline">Options</span>
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div
            role="menu"
            className="absolute top-full right-0 mt-2 w-64 bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/15 p-3 z-50 space-y-2"
          >
            {/* Restart Game */}
            <button
              role="menuitem"
              onClick={() => {
                onRestart();
                setIsOpen(false);
              }}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-black font-bold py-2.5 px-4 rounded-lg shadow-md transition-all duration-200 transform hover:scale-[1.02]"
            >
              🔄 Restart Game
            </button>

            {/* Back to Start */}
            <button
              role="menuitem"
              onClick={() => {
                onBackToStart();
                setIsOpen(false);
              }}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 px-4 rounded-lg border border-white/15 transition-all duration-200"
            >
              🏠 Back to Start
            </button>
          </div>
        </>
      )}
    </div>
  );
}

OptionsMenu.propTypes = {
  onRestart: PropTypes.func.isRequired,
  onBackToStart: PropTypes.func.isRequired,
};
