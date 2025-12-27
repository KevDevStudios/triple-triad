import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const DEFAULT_TRACKS = [
  { id: 'default', name: 'Default', file: '/sounds/background-music.mp3', gain: 1.0 },
  // Game music - Chiptune, Action, Battle themes (CC0 from OpenGameArt)
  { id: 'chiptune-stage-1', name: '🎮 Chiptune Stage 1', file: '/sounds/chiptune-stage-1.ogg', gain: 0.65 },
  { id: 'chiptune-stage-2', name: '🎮 Chiptune Stage 2', file: '/sounds/chiptune-stage-2.ogg', gain: 0.65 },
  { id: 'chiptune-boss', name: '⚔️ Chiptune Boss Fight', file: '/sounds/chiptune-boss-fight.ogg', gain: 0.7 },
  { id: 'alex', name: "🕹️ Alex's Style (Chiptune)", file: '/sounds/alexsstyle-chiptune.mp3', gain: 0.75 },
  { id: 'battle-theme-a', name: '⚔️ Battle Theme A (Epic)', file: '/sounds/battle-theme-a.mp3', gain: 0.5 },
  { id: 'nes-mercury', name: '🚀 NES Mercury (Shooter)', file: '/sounds/nes-mercury.wav', gain: 0.6 },
  { id: 'nes-venus', name: '🚀 NES Venus (Shooter)', file: '/sounds/nes-venus.wav', gain: 0.6 },
  { id: 'nes-mars', name: '🚀 NES Mars (Dark Action)', file: '/sounds/nes-mars.wav', gain: 0.6 },
  { id: 'nes-boss', name: '💀 NES Boss Battle', file: '/sounds/nes-boss.wav', gain: 0.65 },
  { id: 'space-boss', name: '👾 Space Boss Battle', file: '/sounds/space-boss-battle.mp3', gain: 0.45 },
  { id: 'heroic-demise', name: '🛡️ Heroic Demise (Epic)', file: '/sounds/heroic-demise.mp3', gain: 0.4 },
  { id: 'vengeance', name: '⚡ Vengeance Electro', file: '/sounds/vengeance-electro.mp3', gain: 0.35 },
  
  // Lighter/Chill options (kept some variety)
  { id: 'bright-night', name: '🌙 On a Bright Night', file: '/sounds/on-a-bright-night.mp3', gain: 0.35 },
  { id: 'secret', name: '🎵 A Secret to Tell You', file: '/sounds/a-secret-to-tell-you.mp3', gain: 0.85 },
  { id: 'town-theme', name: '🏰 Town Theme RPG', file: '/sounds/town-theme-rpg.mp3', gain: 0.55 },
  { id: 'field-of-dreams', name: '☁️ The Field Of Dreams', file: '/sounds/field-of-dreams.mp3', gain: 0.8 },
  { id: 'enchanted-tiki-86', name: '🗿 Enchanted Tiki 86', file: '/sounds/enchanted-tiki-86.mp3', gain: 0.45 },
  { id: 'cozy-puzzle-title', name: '🧩 Cozy Puzzle Title', file: '/sounds/cozy-puzzle-title.mp3', gain: 0.75 },
];

export default function useMusicPlayer(tracks = DEFAULT_TRACKS) {
  const audioRef = useRef(null);
  const unlockedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(() => {
    const saved = localStorage.getItem('musicEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [trackId, setTrackId] = useState(() => {
    const saved = localStorage.getItem('musicTrackId');
    return saved || tracks[0]?.id || 'default';
  });
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('musicVolume');
    return saved !== null ? parseFloat(saved) : 0.3;
  });

  const currentTrack = useMemo(() => {
    const found = tracks.find(t => t.id === trackId);
    return found || tracks[0] || DEFAULT_TRACKS[0];
  }, [tracks, trackId]);

  const effectiveVolume = useMemo(() => {
    const gain = typeof currentTrack.gain === 'number' ? currentTrack.gain : 1;
    return Math.max(0, Math.min(1, volume * gain));
  }, [volume, currentTrack.gain]);

  const attemptPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise
        .then(() => {
          unlockedRef.current = true;
        })
        .catch(() => {
          // Autoplay restrictions are expected until a user gesture.
        });
    }
  }, []);

  useEffect(() => {
    const audio = new Audio(currentTrack.file);
    audio.loop = true;
    audio.volume = effectiveVolume;
    audioRef.current = audio;

    return () => {
      audio.pause();
      if (audioRef.current === audio) {
        audioRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack.file]);

  // When the track changes, start playing the new audio if music is enabled.
  // This keeps track selection responsive without re-creating audio on volume changes.
  useEffect(() => {
    if (!isPlaying) return;
    attemptPlay();
  }, [currentTrack.file, isPlaying, attemptPlay]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = effectiveVolume;
      localStorage.setItem('musicVolume', volume.toString());
    }
  }, [volume, effectiveVolume]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      attemptPlay();
    } else {
      audioRef.current.pause();
    }
    
    localStorage.setItem('musicEnabled', JSON.stringify(isPlaying));
  }, [isPlaying, attemptPlay]);

  // Autoplay can be blocked until the user interacts with the page.
  // This listens once and tries to start music if enabled.
  useEffect(() => {
    const onFirstGesture = () => {
      if (unlockedRef.current) return;
      if (!isPlaying) return;
      attemptPlay();
    };

    window.addEventListener('pointerdown', onFirstGesture, { passive: true });
    window.addEventListener('keydown', onFirstGesture);
    return () => {
      window.removeEventListener('pointerdown', onFirstGesture);
      window.removeEventListener('keydown', onFirstGesture);
    };
  }, [isPlaying, attemptPlay]);

  useEffect(() => {
    localStorage.setItem('musicTrackId', trackId);
  }, [trackId]);

  const toggleMusic = () => {
    setIsPlaying(prev => {
      const next = !prev;
      if (next) {
        // Try to start immediately from the user gesture.
        attemptPlay();
      }
      return next;
    });
  };

  const changeTrack = (nextTrackId) => {
    setTrackId(nextTrackId);
  };

  const changeVolume = (newVolume) => {
    setVolume(Math.max(0, Math.min(1, newVolume)));
  };

  return { isPlaying, toggleMusic, volume, changeVolume, tracks, trackId, changeTrack };
}
