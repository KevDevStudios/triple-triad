// GameBoard.jsx
import React from "react";
import PropTypes from "prop-types";
import CardCell from "./CardCell";

export default function GameBoard({ board, flipMap, onCellClick }) {
  return (
    <div className="grid grid-cols-3 gap-4 w-[420px] h-[420px] mx-auto mb-4">
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
  );
}

GameBoard.propTypes = {
  board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
  flipMap: PropTypes.objectOf(PropTypes.string).isRequired,
  onCellClick: PropTypes.func.isRequired,
};
