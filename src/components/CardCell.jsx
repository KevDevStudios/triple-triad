// CardCell.jsx
import React from "react";
import PropTypes from "prop-types";
import { elementColors, rarityColors } from "../cards";

export default function CardCell({ cell, r, c, flipClass, onClick }) {
  const getBorderColor = () => {
    if (!cell) return "border-gray-500";
    return cell.owner === "P1" ? "border-blue-400" : "border-red-400";
  };

  const getGradientStyle = () => {
    if (!cell) return {};
    const elementColor = elementColors[cell.element] || "#666";
    const ownerColor = cell.owner === "P1" ? "#3B82F6" : "#EF4444";
    return {
      background: `linear-gradient(135deg, ${ownerColor} 0%, ${elementColor} 100%)`
    };
  };

  return (
    <div
      className={`w-32 h-32 border-4 ${getBorderColor()} flex items-center justify-center relative p-1 text-xs transition-all duration-300 rounded-lg cursor-pointer hover:scale-105 shadow-lg
        ${flipClass} ${
        !cell ? "bg-gradient-to-br from-gray-800 to-gray-900" : ""
      }`}
      style={cell ? getGradientStyle() : {}}
      onClick={onClick}
    >
      {cell ? (
        <div className="w-full h-full flex flex-col items-center justify-between text-white relative bg-black/20 rounded p-1">
          {/* Top Value */}
          <div className="text-lg font-bold bg-black/50 rounded px-2 py-0.5">{cell.values.top}</div>
          
          {/* Middle Row: Left, Name, Right */}
          <div className="flex items-center justify-between w-full px-1">
            <div className="text-lg font-bold bg-black/50 rounded px-1.5 py-0.5">{cell.values.left}</div>
            <div className="text-center flex-1 mx-1">
              <div 
                className="text-[10px] font-bold leading-tight mb-0.5" 
                style={{ color: rarityColors[cell.rarity] || "#FFF" }}
              >
                {cell.name}
              </div>
              <div className="text-[8px] opacity-80">{cell.element}</div>
            </div>
            <div className="text-lg font-bold bg-black/50 rounded px-1.5 py-0.5">{cell.values.right}</div>
          </div>
          
          {/* Bottom Value */}
          <div className="text-lg font-bold bg-black/50 rounded px-2 py-0.5">{cell.values.bottom}</div>
        </div>
      ) : (
        <div className="text-gray-500 text-4xl opacity-30">+</div>
      )}
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
