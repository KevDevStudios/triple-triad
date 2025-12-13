// useGameLogic.js
import { useEffect, useState } from "react";
import { getAIMove } from "../aiLogic";
import { getRandomCards } from "../cards";

const emptyBoard = Array(3)
  .fill(null)
  .map(() => Array(3).fill(null));
const flipSound = new Audio("/sounds/flip.mp3");
const cardPlaceSound = new Audio("/sounds/card-place.mp3");
const winSound = new Audio("/sounds/win.mp3");

export default function useGameLogic({ mode, difficulty }) {
  const [board, setBoard] = useState(emptyBoard);
  const [turn, setTurn] = useState(null);
  const [scores, setScores] = useState({ P1: 0, P2: 0 });
  const [message, setMessage] = useState("Flipping a coin...");
  const [flipMap, setFlipMap] = useState({});
  const [hands, setHands] = useState({ P1: [], P2: [] });
  const [moveInProgress, setMoveInProgress] = useState(false);

  const getFlipDirection = (r, c) => {
    if (r === 0 || r === 2) return "flip-vertical";
    return "flip-horizontal";
  };

  const getFlippableNeighbors = (board, r, c, card, player) => {
    const directions = [
      { dr: -1, dc: 0, own: "top", opp: "bottom" },
      { dr: 1, dc: 0, own: "bottom", opp: "top" },
      { dr: 0, dc: -1, own: "left", opp: "right" },
      { dr: 0, dc: 1, own: "right", opp: "left" },
    ];
    const flips = {};

    for (const { dr, dc, own, opp } of directions) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr > 2 || nc < 0 || nc > 2) continue;

      const neighbor = board[nr][nc];
      if (neighbor && neighbor.owner !== player) {
        if (card.values[own] > neighbor.values[opp]) {
          flips[`${nr}-${nc}`] = { r: nr, c: nc };
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

  const handleCellClick = (r, c, player = turn) => {
    if (
      board[r][c] ||
      !turn ||
      moveInProgress ||
      (mode === "PVE" && turn === "P2" && player !== "P2")
    )
      return;

    setMoveInProgress(true);

    const currentHand = [...hands[player]];
    const card = currentHand.shift();
    if (!card) return;

    const newCard = { ...card, owner: player };
    const newBoard = board.map((row) => [...row]);
    newBoard[r][c] = newCard;

    cardPlaceSound.play();

    const flips = getFlippableNeighbors(newBoard, r, c, newCard, player);
    if (Object.keys(flips).length > 0) flipSound.play();

    for (const key in flips) {
      const { r: fr, c: fc } = flips[key];
      newBoard[fr][fc] = { ...newBoard[fr][fc], owner: player };
    }

    const flipEntries = Object.keys(flips).reduce((acc, k) => {
      const [row, col] = k.split("-").map(Number);
      acc[k] = getFlipDirection(row, col);
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
        winSound.play();
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
      setMoveInProgress(false);
    }, 600);
  };

  const resetGame = () => {
    setBoard(emptyBoard.map((row) => [...row]));
    setHands({ P1: [], P2: [] });
    setScores({ P1: 0, P2: 0 });
    setTurn(null);
    setMessage("Flipping a coin...");
    setFlipMap({});
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
    setTurn(starter);
    setMessage(`${starter} goes first!`);
  };

  useEffect(() => {
    if (mode === "PVE" && turn === "P2" && hands.P2.length > 0) {
      setTimeout(() => {
        const [r, c] = getAIMove(board, difficulty) || [];
        if (r !== undefined) handleCellClick(r, c, "P2");
      }, 700);
    }
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
  };
}
