// CardCell.jsx
import React from "react";
import PropTypes from "prop-types";

export default function CardCell({ cell, r, c, flipClass, onClick }) {
  return (
    <div
      className={`w-32 h-32 border border-white flex items-center justify-center relative p-1 text-xs transition-transform duration-300
        ${flipClass} ${
        cell?.owner === "P1"
          ? "bg-blue-500"
          : cell?.owner === "P2"
          ? "bg-red-500"
          : "bg-gray-700"
      }`}
      onClick={onClick}
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
}

CardCell.propTypes = {
  cell: PropTypes.object,
  r: PropTypes.number.isRequired,
  c: PropTypes.number.isRequired,
  flipClass: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};
