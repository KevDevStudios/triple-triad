// useGameRecorder.js
import { useState, useRef, useCallback } from "react";

export default function useGameRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  const DOWNLOAD_CLEANUP_DELAY = 100; // Delay before cleaning up download anchor

  const getSupportedMimeType = () => {
    const types = [
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
    ];
    return types.find(type => MediaRecorder.isTypeSupported(type)) || '';
  };

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      // Clear any previous recording when starting a new one
      setRecordedChunks([]);
      
      // Capture the entire screen/window
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          mediaSource: 'screen',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false // Audio recording not implemented - would require additional permission handling
      });

      streamRef.current = stream;
      const mimeType = getSupportedMimeType();
      
      if (!mimeType) {
        throw new Error('No supported video format found');
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });

      mediaRecorderRef.current = mediaRecorder;
      // Local chunks array to capture recording data via closure
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        setRecordedChunks(chunks);
        setIsRecording(false);
        
        // Stop all tracks to release the screen capture
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
      setError(err.message || 'Failed to start recording');
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  }, [isRecording]);

  const downloadRecording = useCallback(() => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `triple-triad-gameplay-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up - use timeout to ensure download completes
      setTimeout(() => {
        if (a.parentNode) {
          document.body.removeChild(a);
        }
        URL.revokeObjectURL(url);
      }, DOWNLOAD_CLEANUP_DELAY);
      
      // Clear recorded chunks after download
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  return {
    isRecording,
    hasRecording: recordedChunks.length > 0,
    error,
    startRecording,
    stopRecording,
    downloadRecording,
  };
}
