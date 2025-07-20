import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getAIMove } from "./aiLogic";
import { getRandomCards } from "./cards";

const emptyBoard = Array(3)
  .fill(null)
  .map(() => Array(3).fill(null));
const flipSound = new Audio("/sounds/flip.mp3");

export default function Game({ mode, difficulty }) {
  const [board, setBoard] = useState(emptyBoard);
  const [turn, setTurn] = useState(null);
  const [scores, setScores] = useState({ P1: 0, P2: 0 });
  const [message, setMessage] = useState("Flipping a coin...");
  const [flipMap, setFlipMap] = useState({});
  const [hands, setHands] = useState({ P1: [], P2: [] });
  const [moveInProgress, setMoveInProgress] = useState(false);

  const resetGame = () => {
    const newBoard = Array(3)
      .fill(null)
      .map(() => Array(3).fill(null));
    setBoard(newBoard);
    setHands({
      P1: getRandomCards(5),
      P2: getRandomCards(5),
    });
    const starter = Math.random() < 0.5 ? "P1" : "P2";
    setTurn(starter);
    setScores({ P1: 0, P2: 0 });
    setMessage(starter + " goes first!");
  };

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    if (mode === "PVE" && turn === "P2" && hands.P2.length > 0) {
      setTimeout(() => {
        const [r, c] = getAIMove(board, difficulty) || [];
        if (r !== undefined) handleCellClick(r, c, "P2");
      }, 700);
    }
  }, [turn]);

  const getFlipDirection = (r, c) => {
    if (r === 0 || r === 2) return "flip-vertical";
    if (c === 0 || c === 2) return "flip-horizontal";
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
      if (cell) {
        score[cell.owner] += 1;
      }
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
    const newBoard = board.map((row) => row.slice());
    newBoard[r][c] = newCard;

    const flips = getFlippableNeighbors(newBoard, r, c, newCard, player);
    if (Object.keys(flips).length > 0) flipSound.play();

    for (const key in flips) {
      const { r: fr, c: fc } = flips[key];
      newBoard[fr][fc] = { ...newBoard[fr][fc], owner: player };
    }

    setBoard(newBoard);
    setHands({ ...hands, [player]: currentHand });
    setScores(calculateScores(newBoard));

    const flipEntries = Object.keys(flips).reduce((acc, k) => {
      const [row, col] = k.split("-").map(Number);
      acc[k] = getFlipDirection(row, col);
      return acc;
    }, {});

    setFlipMap(flipEntries);

    setTimeout(() => {
      setFlipMap({});
      const allFilled = newBoard.flat().every((cell) => cell !== null);
      const finalScores = calculateScores(newBoard);
      if (allFilled) {
        const winnerMsg =
          finalScores.P1 > finalScores.P2
            ? "Player 1 wins!"
            : finalScores.P2 > finalScores.P1
            ? "Player 2 wins!"
            : "It's a tie!";
        setMessage(winnerMsg);
        setTurn(null);
      } else {
        setTurn(player === "P1" ? "P2" : "P1");
      }
      setMoveInProgress(false);
    }, 600);
  };

  return (
    <>
      <div className="p-4 text-white">
        <div className="bg-black/60 text-white rounded-lg p-2 text-center text-lg font-bold mb-4 shadow-md">
          Score: Player 1 — {scores.P1} | Player 2 — {scores.P2}
        </div>
        <div className="text-lg mb-4 text-center">{message}</div>
        <div className="grid grid-cols-3 gap-4 w-[420px] h-[420px] mx-auto mb-4">
          {board.map((row, r) =>
            row.map((cell, c) => {
              const key = r + "-" + c;
              const flipClass = flipMap[key] || "";
              return (
                <div
                  key={key}
                  className={`w-32 h-32 border border-white flex items-center justify-center relative p-1 text-xs transition-transform duration-300
                    ${flipClass} ${
                    cell?.owner === "P1"
                      ? "bg-blue-500"
                      : cell?.owner === "P2"
                      ? "bg-red-500"
                      : "bg-gray-700"
                  }`}
                  onClick={() => handleCellClick(r, c)}
                >
                  {cell ? (
                    <div className="grid grid-cols-3 grid-rows-3 w-full h-full text-center font-bold">
                      <div></div>
                      <div>{cell.values.top}</div>
                      <div></div>
                      <div>{cell.values.left}</div>
                      <div className="text-xs leading-3">{cell.name}</div>
                      <div>{cell.values.right}</div>
                      <div></div>
                      <div>{cell.values.bottom}</div>
                      <div></div>
                    </div>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
        <div className="text-center">
          <button
            onClick={resetGame}
            className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
          >
            Restart Game
          </button>
        </div>
      </div>
    </>
  );
}

Game.propTypes = {
  mode: PropTypes.string.isRequired,
  difficulty: PropTypes.string.isRequired,
};
