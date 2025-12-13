// GameBoard.jsx
import React from "react";
import PropTypes from "prop-types";
import CardCell from "./CardCell";

export default function GameBoard({ board, flipMap, onCellClick }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl blur-xl"></div>
      <div className="grid grid-cols-3 gap-4 w-[420px] h-[420px] mx-auto mb-4 p-4 bg-black/30 rounded-2xl backdrop-blur-sm relative z-10 shadow-2xl border-2 border-white/10">
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
  );
}

GameBoard.propTypes = {
  board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
  flipMap: PropTypes.objectOf(PropTypes.string).isRequired,
  onCellClick: PropTypes.func.isRequired,
};
