// GameBoard.jsx
import React from "react";
import PropTypes from "prop-types";
import CardCell from "./CardCell";

export default function GameBoard({ board, flipMap, onCellClick }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/25 to-blue-900/25 rounded-3xl blur-2xl"></div>
      <div className="relative z-10 w-fit mx-auto p-4 rounded-3xl bg-black/40 backdrop-blur-md shadow-2xl border border-white/15">
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
};
