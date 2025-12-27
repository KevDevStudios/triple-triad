// CardCell.jsx
import React from "react";
import PropTypes from "prop-types";
import { rarityColors, elementSymbols } from "../cards";

export default function CardCell({ cell, r, c, flipClass, onClick }) {
  const getBorderColor = () => {
    if (!cell) return "border-gray-500";
    return cell.owner === "P1" ? "border-blue-500" : "border-red-500";
  };

  const getCardBackgroundColor = () => {
    if (!cell) return {};
    // Solid color background for clear ownership
    const ownerColor = cell.owner === "P1" ? "#3B82F6" : "#EF4444";
    return {
      backgroundColor: ownerColor
    };
  };

  return (
    <div
      className={`tt-card border-2 ${getBorderColor()} flex items-center justify-center relative p-1 text-xs transition-all duration-300 rounded-xl shadow-xl
        ${flipClass} ${
        !cell ? "bg-gradient-to-br from-gray-800 to-gray-900 cursor-pointer hover:brightness-110" : "cursor-default"
      }`}
      style={{ ...(cell ? getCardBackgroundColor() : {}), width: 'var(--tt-card-w)', height: 'var(--tt-card-h)' }}
      onClick={onClick}
    >
      {cell ? (
        <div className="tt-card-inner w-full h-full">
          {/* FRONT */}
          <div className="tt-card-face tt-card-front w-full h-full flex flex-col items-center justify-between text-white relative rounded-lg overflow-hidden py-1">
            <div className="absolute inset-0 ring-1 ring-white/20 rounded-lg pointer-events-none" />

            {/* Background Image */}
            {cell.image && (
              <div className="absolute inset-0 opacity-40">
                <img 
                  src={cell.image} 
                  alt={cell.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            {/* Top Value */}
            <div className="text-lg font-bold bg-black/70 rounded px-2 py-0.5 z-10 shadow-lg">{cell.values.top}</div>

            {/* Middle Row: Left, Element, Right */}
            <div className="flex items-center justify-between w-full px-1 z-10">
              <div className="text-lg font-bold bg-black/70 rounded px-1.5 py-0.5 shadow-lg">{cell.values.left}</div>
              <div className="text-base">{elementSymbols[cell.element] || cell.element}</div>
              <div className="text-lg font-bold bg-black/70 rounded px-1.5 py-0.5 shadow-lg">{cell.values.right}</div>
            </div>

            {/* Bottom Value */}
            <div className="text-lg font-bold bg-black/70 rounded px-2 py-0.5 z-10 shadow-lg">{cell.values.bottom}</div>

            {/* Name at Bottom */}
            <div className="w-full z-10 px-1">
              <div 
                className="text-[10px] font-bold leading-tight text-center drop-shadow-lg bg-black/60 rounded py-0.5 px-1 truncate" 
                style={{ color: rarityColors[cell.rarity] || "#FFF" }}
              >
                {cell.name}
              </div>
            </div>
          </div>

          {/* BACK */}
          <div
            className={`tt-card-face tt-card-back w-full h-full rounded-lg overflow-hidden flex items-center justify-center border border-white/10 bg-gradient-to-br from-slate-950/95 via-indigo-950/60 to-purple-950/80 ${
              flipClass === "flip-vertical" ? "tt-back-vertical" : "tt-back-horizontal"
            }`}
          >
            <div className="w-full h-full relative">
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),transparent_55%)]" />
              <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.14),transparent_55%)]" />
              <div className="absolute inset-x-0 bottom-0 h-10 bg-black/35" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white/90 text-3xl font-black tracking-wider drop-shadow">TT</div>
              </div>
            </div>
          </div>
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
