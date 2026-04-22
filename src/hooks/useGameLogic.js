// useGameLogic.js
import { useEffect, useRef, useState } from "react";
import { getAIMove } from "../aiLogic";
import { getRandomCards } from "../cards";
import { computeCaptures, getModeById } from "../gameModes";

const emptyBoard = () =>
  Array(3)
    .fill(null)
    .map(() => Array(3).fill(null));

const MAX_SUDDEN_DEATH_ROUNDS = 3;

export default function useGameLogic({ mode, difficulty, gameMode = "classic" }) {
  const modeConfig = getModeById(gameMode);
  const rules = modeConfig.rules;

  const [board, setBoard] = useState(emptyBoard);
  const [turn, setTurn] = useState(null);
  const [scores, setScores] = useState({ P1: 0, P2: 0 });
  const [message, setMessage] = useState("Flipping a coin...");
  const [flipMap, setFlipMap] = useState({});
  const [hands, setHands] = useState({ P1: [], P2: [] });
  const [moveInProgress, setMoveInProgress] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [coinFlip, setCoinFlip] = useState({ phase: "idle", target: null });
  const [suddenDeathRound, setSuddenDeathRound] = useState(0);

  const moveInProgressRef = useRef(false);
  const sfxLastPlayedAtRef = useRef(new Map());
  const audioCtxRef = useRef(null);
  const coinFlipTimeoutsRef = useRef({ auto: null, flipDone: null, hide: null });
  const rulesRef = useRef(rules);
  rulesRef.current = rules;
  const suddenDeathRoundRef = useRef(0);
  suddenDeathRoundRef.current = suddenDeathRound;

  const FLIP_ANIMATION_MS = 1400;

  const getAudioCtx = () => {
    if (audioCtxRef.current) return audioCtxRef.current;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      audioCtxRef.current = new Ctx();
      return audioCtxRef.current;
    } catch {
      return null;
    }
  };

  // Synthesize short SFX via Web Audio so we don't depend on bundled audio files.
  const playSfx = (name, { volume = 0.5, cooldownMs = 0 } = {}) => {
    try {
      const now = Date.now();
      const lastAt = sfxLastPlayedAtRef.current.get(name) || 0;
      if (cooldownMs > 0 && now - lastAt < cooldownMs) return;
      sfxLastPlayedAtRef.current.set(name, now);

      const ctx = getAudioCtx();
      if (!ctx) return;
      if (ctx.state === "suspended") ctx.resume().catch(() => {});

      const playTone = ({
        freq,
        endFreq,
        duration,
        type = "triangle",
        startAt = 0,
        gain = 0.25,
      }) => {
        const t0 = ctx.currentTime + startAt;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t0);
        if (typeof endFreq === "number") {
          osc.frequency.exponentialRampToValueAtTime(
            Math.max(1, endFreq),
            t0 + duration
          );
        }
        const peak = gain * volume;
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(peak, t0 + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
        osc.connect(g).connect(ctx.destination);
        osc.start(t0);
        osc.stop(t0 + duration + 0.02);
      };

      switch (name) {
        case "cardPlace":
          playTone({ freq: 520, endFreq: 240, duration: 0.09, type: "triangle", gain: 0.35 });
          playTone({ freq: 160, endFreq: 110, duration: 0.12, type: "sine", gain: 0.25 });
          break;
        case "flip":
          playTone({ freq: 420, endFreq: 880, duration: 0.16, type: "square", gain: 0.22 });
          playTone({ freq: 880, endFreq: 1320, duration: 0.18, type: "triangle", gain: 0.18, startAt: 0.05 });
          break;
        case "special":
          // Distinctive chime when Same/Plus triggers.
          playTone({ freq: 660, duration: 0.12, type: "triangle", gain: 0.3 });
          playTone({ freq: 990, duration: 0.14, type: "triangle", startAt: 0.07, gain: 0.3 });
          playTone({ freq: 1320, duration: 0.18, type: "triangle", startAt: 0.14, gain: 0.28 });
          break;
        case "coinSpin": {
          // Rapid metallic shimmer: many short sine tones at decreasing intervals
          // simulating a coin spinning and slowing down.
          const spinCount = 14;
          for (let i = 0; i < spinCount; i++) {
            // Space taps closer together early, then spread (easing out).
            const t = (i / spinCount) * (i / spinCount) * 0.95;
            const freq = 900 + Math.sin(i * 1.7) * 220;
            playTone({ freq, endFreq: freq * 0.88, duration: 0.055, type: "sine", startAt: t, gain: 0.18 });
          }
          // Low thud as coin hits the table at the end.
          playTone({ freq: 160, endFreq: 60, duration: 0.18, type: "sine", startAt: 0.9, gain: 0.45 });
          break;
        }
        case "coinReveal": {
          // Short bright chime: two ascending tones.
          playTone({ freq: 880, duration: 0.14, type: "triangle", gain: 0.35 });
          playTone({ freq: 1320, duration: 0.2, type: "triangle", startAt: 0.1, gain: 0.3 });
          break;
        }
        case "win": {
          const notes = [523.25, 659.25, 783.99, 1046.5];
          notes.forEach((f, i) => {
            playTone({
              freq: f,
              duration: 0.18,
              type: "triangle",
              startAt: i * 0.11,
              gain: 0.32,
            });
          });
          break;
        }
        default:
          break;
      }
    } catch {
      // ignore audio errors
    }
  };

  // Score = cards owned on the board. (Cards remaining in hand are the player's
  // own, so they don't change the delta — we use pure board-owned count for a
  // clean P1/P2 split.)
  const calculateScores = (boardState) => {
    const score = { P1: 0, P2: 0 };
    boardState.flat().forEach((cell) => {
      if (cell) score[cell.owner] += 1;
    });
    return score;
  };

  const handleCellClick = (r, c, player = turn, cardIndex = selectedCardIndex) => {
    if (
      board[r][c] ||
      !turn ||
      moveInProgressRef.current ||
      (mode === "PVE" && turn === "P2" && player !== "P2")
    )
      return;

    if (player === "P1" && cardIndex === null) {
      return;
    }

    moveInProgressRef.current = true;
    setMoveInProgress(true);

    const currentHand = [...hands[player]];
    // P1 always picks via selectedCardIndex. P2 (AI) may pass an explicit
    // cardIndex; if not, default to the first card in hand.
    const p2Index = cardIndex !== null && cardIndex !== undefined ? cardIndex : 0;
    const card =
      player === "P1" ? currentHand[cardIndex] : currentHand[p2Index];
    if (!card) {
      moveInProgressRef.current = false;
      setMoveInProgress(false);
      return;
    }

    if (player === "P1") {
      currentHand.splice(cardIndex, 1);
      setSelectedCardIndex(null);
    } else {
      currentHand.splice(p2Index, 1);
    }

    const placedCard = { ...card, owner: player };

    playSfx("cardPlace", { cooldownMs: 80 });

    const { flipMap: flipEntries, finalBoard, didFlip, didSpecial } = computeCaptures(
      board,
      r,
      c,
      placedCard,
      player,
      rulesRef.current
    );

    if (didSpecial) {
      playSfx("special", { cooldownMs: 400 });
    } else if (didFlip) {
      playSfx("flip", { cooldownMs: 1100 });
    }

    const nextHands = { ...hands, [player]: currentHand };
    setBoard(finalBoard);
    setHands(nextHands);
    setScores(calculateScores(finalBoard));
    setFlipMap(flipEntries);

    setTimeout(() => {
      setFlipMap({});
      const allFilled = finalBoard.flat().every((cell) => cell !== null);
      const finalScores = calculateScores(finalBoard);
      if (allFilled) {
        const isTie = finalScores.P1 === finalScores.P2;
        const canSuddenDeath =
          rulesRef.current.suddenDeath &&
          isTie &&
          suddenDeathRoundRef.current < MAX_SUDDEN_DEATH_ROUNDS;

        if (canSuddenDeath) {
          playSfx("flip", { cooldownMs: 200 });
          // Redeal using current card ownership (standard TT Sudden Death).
          const p1Pool = [
            ...finalBoard.flat().filter((c) => c && c.owner === "P1"),
            ...(nextHands.P1 || []),
          ];
          const p2Pool = [
            ...finalBoard.flat().filter((c) => c && c.owner === "P2"),
            ...(nextHands.P2 || []),
          ];
          const shuffle = (arr) => {
            const a = arr.map(({ owner, ...rest }) => rest);
            for (let i = a.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
          };
          const newP1 = shuffle(p1Pool).slice(0, 5);
          const newP2 = shuffle(p2Pool).slice(0, 5);
          // Defensive: if a side has fewer than 5 (shouldn't happen in a true
          // tie), top up from the other pool.
          while (newP1.length < 5 && p2Pool.length) {
            const { owner, ...c } = p2Pool.pop();
            newP1.push(c);
          }
          while (newP2.length < 5 && p1Pool.length) {
            const { owner, ...c } = p1Pool.pop();
            newP2.push(c);
          }

          const nextRound = suddenDeathRoundRef.current + 1;
          setSuddenDeathRound(nextRound);
          const fresh = emptyBoard();
          setBoard(fresh);
          setHands({ P1: newP1, P2: newP2 });
          setScores({ P1: 0, P2: 0 });
          const starter = Math.random() < 0.5 ? "P1" : "P2";
          setTurn(starter);
          setMessage(
            `Sudden Death — Round ${nextRound}! ${
              starter === "P1" ? "Player 1" : "Player 2"
            } goes first.`
          );
        } else {
          playSfx("win", { cooldownMs: 1000 });
          setMessage(
            finalScores.P1 > finalScores.P2
              ? "Player 1 wins!"
              : finalScores.P2 > finalScores.P1
              ? "Player 2 wins!"
              : "It's a tie!"
          );
          setTurn(null);
        }
      } else {
        setTurn(player === "P1" ? "P2" : "P1");
      }
      moveInProgressRef.current = false;
      setMoveInProgress(false);
    }, FLIP_ANIMATION_MS);
  };

  const selectCard = (index) => {
    if (turn === "P1" && !moveInProgress) {
      setSelectedCardIndex(index);
    }
  };

  const resetGame = () => {
    setBoard(emptyBoard());
    setHands({ P1: [], P2: [] });
    setScores({ P1: 0, P2: 0 });
    setTurn(null);
    setMessage("Flipping a coin...");
    setFlipMap({});
    setSelectedCardIndex(null);
    setSuddenDeathRound(0);
    moveInProgressRef.current = false;
    setMoveInProgress(false);
    setCoinFlip({ phase: "idle", target: null });
  };

  const initializeWithStarter = (starter) => {
    const newBoard = emptyBoard();
    setBoard(newBoard);
    setHands({
      P1: getRandomCards(5),
      P2: getRandomCards(5),
    });
    setScores({ P1: 0, P2: 0 });
    setFlipMap({});
    setSelectedCardIndex(null);
    setSuddenDeathRound(0);
    moveInProgressRef.current = false;
    setMoveInProgress(false);
    setTurn(starter);
    setMessage(`${starter} goes first!`);
  };

  const clearCoinFlipTimeouts = () => {
    const t = coinFlipTimeoutsRef.current;
    if (t.auto) clearTimeout(t.auto);
    if (t.flipDone) clearTimeout(t.flipDone);
    if (t.hide) clearTimeout(t.hide);
    coinFlipTimeoutsRef.current = { auto: null, flipDone: null, hide: null };
  };

  const startNewGameWithCoinFlip = ({ autoFlipAfterMs = 2500, flipDurationMs = 1100, revealMs = 1100 } = {}) => {
    clearCoinFlipTimeouts();

    setBoard(emptyBoard());
    setHands({ P1: [], P2: [] });
    setScores({ P1: 0, P2: 0 });
    setTurn(null);
    setFlipMap({});
    setSelectedCardIndex(null);
    setSuddenDeathRound(0);
    moveInProgressRef.current = false;
    setMoveInProgress(false);

    setMessage("Flipping a coin...");
    setCoinFlip({ phase: "awaiting", target: null });

    if (typeof autoFlipAfterMs === "number" && autoFlipAfterMs >= 0) {
      coinFlipTimeoutsRef.current.auto = setTimeout(() => {
        triggerCoinFlip({ flipDurationMs, revealMs });
      }, autoFlipAfterMs);
    }
  };

  const triggerCoinFlip = ({ flipDurationMs = 1100, revealMs = 1100 } = {}) => {
    setCoinFlip((prev) => {
      if (prev.phase !== "awaiting") return prev;

      clearCoinFlipTimeouts();

      const target = Math.random() < 0.5 ? "P1" : "P2";
      setMessage("Flipping a coin...");
      playSfx("coinSpin");

      coinFlipTimeoutsRef.current.flipDone = setTimeout(() => {
        initializeWithStarter(target);
        playSfx("coinReveal");
        setMessage(`Coin flip: ${target} goes first!`);
        setCoinFlip({ phase: "revealed", target });

        coinFlipTimeoutsRef.current.hide = setTimeout(() => {
          setCoinFlip({ phase: "idle", target: null });
          setMessage(`${target} goes first!`);
        }, revealMs);
      }, flipDurationMs);

      return { phase: "flipping", target };
    });
  };

  useEffect(() => {
    return () => {
      clearCoinFlipTimeouts();
    };
  }, []);

  useEffect(() => {
    if (mode === "PVE" && turn === "P2" && hands.P2.length > 0) {
      setTimeout(() => {
        const move = getAIMove(board, difficulty, hands.P2, rulesRef.current);
        if (move) {
          const [r, c] = move;
          if (r !== undefined) handleCellClick(r, c, "P2", move.cardIndex ?? 0);
        }
      }, 700);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn]);

  return {
    board,
    turn,
    scores,
    message,
    flipMap,
    hands,
    moveInProgress,
    handleCellClick,
    resetGame,
    initializeWithStarter,
    startNewGameWithCoinFlip,
    coinFlip,
    triggerCoinFlip,
    selectedCardIndex,
    selectCard,
    suddenDeathRound,
    modeConfig,
  };
}
