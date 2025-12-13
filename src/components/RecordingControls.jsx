// RecordingControls.jsx
import React from "react";
import PropTypes from "prop-types";

const Z_INDEX_RECORDING_CONTROLS = 40;

export default function RecordingControls({
  isRecording,
  hasRecording,
  error,
  onStartRecording,
  onStopRecording,
  onDownloadRecording,
}) {
  return (
    <div className="fixed top-4 left-4 flex flex-col gap-2" style={{ zIndex: Z_INDEX_RECORDING_CONTROLS }}>
      {error && (
        <div className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm max-w-xs">
          ⚠️ {error}
        </div>
      )}
      
      {!isRecording && !hasRecording && (
        <button
          onClick={onStartRecording}
          className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          title="Start Recording"
        >
          <span className="text-xl">🎥</span>
          <span>Record</span>
        </button>
      )}

      {isRecording && (
        <button
          onClick={onStopRecording}
          className="bg-gradient-to-r from-red-600 to-red-800 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2 animate-pulse"
          title="Stop Recording"
        >
          <span className="text-xl">⏹️</span>
          <span>Recording...</span>
        </button>
      )}

      {hasRecording && !isRecording && (
        <div className="flex flex-col gap-2">
          <button
            onClick={onDownloadRecording}
            className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            title="Download Recording"
          >
            <span className="text-xl">💾</span>
            <span>Download</span>
          </button>
          <button
            onClick={onStartRecording}
            className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            title="Start New Recording"
          >
            <span className="text-xl">🎥</span>
            <span>New</span>
          </button>
        </div>
      )}
    </div>
  );
}

RecordingControls.propTypes = {
  isRecording: PropTypes.bool.isRequired,
  hasRecording: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onStartRecording: PropTypes.func.isRequired,
  onStopRecording: PropTypes.func.isRequired,
  onDownloadRecording: PropTypes.func.isRequired,
};
