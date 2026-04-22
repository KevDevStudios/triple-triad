// GameBoard.jsx
import React from "react";
import PropTypes from "prop-types";
import CardCell from "./CardCell";

export default function GameBoard({ board, flipMap, onCellClick, highlightEmpty }) {
  return (
    <div className="relative">
      <div className="absolute -inset-4 bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-indigo-500/20 rounded-[2rem] blur-2xl"></div>
      <div className="relative z-10 w-fit mx-auto p-4 rounded-3xl bg-black/50 backdrop-blur-md shadow-2xl border border-white/15 ring-1 ring-white/5">
        <div className="grid grid-cols-3 gap-3">
        {board.map((row, r) =>
          row.map((cell, c) => {
            const key = `${r}-${c}`;
            return (
              <CardCell
                key={key}
                cell={cell}
                r={r}
                c={c}
                flipClass={flipMap[key] || ""}
                onClick={() => onCellClick(r, c)}
                highlight={highlightEmpty && !cell}
              />
            );
          })
        )}
        </div>
      </div>
    </div>
  );
}

GameBoard.propTypes = {
  board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
  flipMap: PropTypes.objectOf(PropTypes.string).isRequired,
  onCellClick: PropTypes.func.isRequired,
  highlightEmpty: PropTypes.bool,
};
