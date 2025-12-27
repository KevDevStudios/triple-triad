// useGameLogic.js
import { useEffect, useRef, useState } from "react";
import { getAIMove } from "../aiLogic";
import { getRandomCards } from "../cards";

const emptyBoard = Array(3)
  .fill(null)
  .map(() => Array(3).fill(null));

export default function useGameLogic({ mode, difficulty }) {
  const [board, setBoard] = useState(emptyBoard);
  const [turn, setTurn] = useState(null);
  const [scores, setScores] = useState({ P1: 0, P2: 0 });
  const [message, setMessage] = useState("Flipping a coin...");
  const [flipMap, setFlipMap] = useState({});
  const [hands, setHands] = useState({ P1: [], P2: [] });
  const [moveInProgress, setMoveInProgress] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [coinFlip, setCoinFlip] = useState({ phase: "idle", target: null });

  const moveInProgressRef = useRef(false);
  const sfxLastPlayedAtRef = useRef(new Map());
  const coinFlipTimeoutsRef = useRef({ auto: null, flipDone: null, hide: null });

  const FLIP_ANIMATION_MS = 1400;

  const playSfx = (soundPath, { volume = 0.5, cooldownMs = 0 } = {}) => {
    try {
      const now = Date.now();
      const lastAt = sfxLastPlayedAtRef.current.get(soundPath) || 0;
      if (cooldownMs > 0 && now - lastAt < cooldownMs) return;
      sfxLastPlayedAtRef.current.set(soundPath, now);

      const audio = new Audio(soundPath);
      audio.loop = false;
      audio.preload = "auto";
      audio.volume = volume;
      audio.play().catch(() => {});
    } catch {
      // ignore audio errors
    }
  };


  const getFlippableNeighbors = (board, r, c, card, player) => {
    const directions = [
      { dr: -1, dc: 0, own: "top", opp: "bottom", dir: "vertical" },
      { dr: 1, dc: 0, own: "bottom", opp: "top", dir: "vertical" },
      { dr: 0, dc: -1, own: "left", opp: "right", dir: "horizontal" },
      { dr: 0, dc: 1, own: "right", opp: "left", dir: "horizontal" },
    ];
    const flips = {};

    for (const { dr, dc, own, opp, dir } of directions) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr > 2 || nc < 0 || nc > 2) continue;

      const neighbor = board[nr][nc];
      if (neighbor && neighbor.owner !== player) {
        if (card.values[own] > neighbor.values[opp]) {
          flips[`${nr}-${nc}`] = { r: nr, c: nc, dir };
        }
      }
    }

    return flips;
  };

  const calculateScores = (board) => {
    const score = { P1: 0, P2: 0 };
    board.flat().forEach((cell) => {
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

    // For P1, require a card to be selected
    if (player === "P1" && cardIndex === null) {
      return;
    }

    moveInProgressRef.current = true;
    setMoveInProgress(true);

    const currentHand = [...hands[player]];
    // For P1, use selected card; for P2 (AI), use first card
    const card = player === "P1" ? currentHand[cardIndex] : currentHand.shift();
    if (!card) {
      moveInProgressRef.current = false;
      setMoveInProgress(false);
      return;
    }
    
    // Remove the selected card from hand
    if (player === "P1") {
      currentHand.splice(cardIndex, 1);
      setSelectedCardIndex(null);
    }

    const newCard = { ...card, owner: player };
    const newBoard = board.map((row) => [...row]);
    newBoard[r][c] = newCard;

    playSfx("/sounds/card-place.mp3", { cooldownMs: 80 });

    const flips = getFlippableNeighbors(newBoard, r, c, newCard, player);
    const flipKeys = Object.keys(flips);
    const didFlip = flipKeys.some((k) => {
      const { r: fr, c: fc } = flips[k];
      const neighbor = newBoard[fr][fc];
      return !!neighbor && neighbor.owner !== player;
    });

    for (const key of flipKeys) {
      const { r: fr, c: fc } = flips[key];
      newBoard[fr][fc] = { ...newBoard[fr][fc], owner: player };
    }

    if (didFlip) {
      // Keep this fairly high to avoid occasional rapid re-triggers feeling like spam.
      playSfx("/sounds/flip.mp3", { cooldownMs: 1100 });
    }

    const flipEntries = flipKeys.reduce((acc, k) => {
      const flipInfo = flips[k];
      acc[k] = flipInfo.dir === "vertical" ? "flip-vertical" : "flip-horizontal";
      return acc;
    }, {});

    setBoard(newBoard);
    setHands({ ...hands, [player]: currentHand });
    setScores(calculateScores(newBoard));
    setFlipMap(flipEntries);

    setTimeout(() => {
      setFlipMap({});
      const allFilled = newBoard.flat().every((cell) => cell !== null);
      const finalScores = calculateScores(newBoard);
      if (allFilled) {
        playSfx("/sounds/win.mp3", { cooldownMs: 1000 });
        setMessage(
          finalScores.P1 > finalScores.P2
            ? "Player 1 wins!"
            : finalScores.P2 > finalScores.P1
            ? "Player 2 wins!"
            : "It's a tie!"
        );
        setTurn(null);
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
    setBoard(emptyBoard.map((row) => [...row]));
    setHands({ P1: [], P2: [] });
    setScores({ P1: 0, P2: 0 });
    setTurn(null);
    setMessage("Flipping a coin...");
    setFlipMap({});
    setSelectedCardIndex(null);
    moveInProgressRef.current = false;
    setMoveInProgress(false);
    setCoinFlip({ phase: "idle", target: null });
  };

  const initializeWithStarter = (starter) => {
    const newBoard = Array(3)
      .fill(null)
      .map(() => Array(3).fill(null));
    setBoard(newBoard);
    setHands({
      P1: getRandomCards(5),
      P2: getRandomCards(5),
    });
    setScores({ P1: 0, P2: 0 });
    setFlipMap({});
    setSelectedCardIndex(null);
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

    // Clear the board/hand immediately so the flip is visible and interaction is disabled.
    setBoard(emptyBoard.map((row) => [...row]));
    setHands({ P1: [], P2: [] });
    setScores({ P1: 0, P2: 0 });
    setTurn(null);
    setFlipMap({});
    setSelectedCardIndex(null);
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

      coinFlipTimeoutsRef.current.flipDone = setTimeout(() => {
        initializeWithStarter(target);
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
        const [r, c] = getAIMove(board, difficulty, hands.P2) || [];
        if (r !== undefined) handleCellClick(r, c, "P2");
      }, 700);
    }
    // Only trigger on turn changes to avoid infinite loops
    // board, difficulty, handleCellClick, and hands are stable references
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
  };
}
