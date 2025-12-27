import React, { useState } from 'react';
import PropTypes from 'prop-types';

export default function OptionsMenu({ 
  onRestart,
  onBackToStart
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-br from-purple-800/90 to-indigo-900/90 backdrop-blur-md text-white font-bold py-2 px-3 rounded-lg shadow-lg border-2 border-white/20 hover:border-white/40 transition-all duration-300"
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
          <div className="absolute top-full right-0 mt-2 w-64 bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-white/20 p-4 z-50 space-y-3">
            {/* Restart Game */}
            <button
              onClick={() => {
                onRestart();
                setIsOpen(false);
              }}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-black font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              🔄 Restart Game
            </button>

            {/* Back to Start */}
            <button
              onClick={() => {
                onBackToStart();
                setIsOpen(false);
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
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
