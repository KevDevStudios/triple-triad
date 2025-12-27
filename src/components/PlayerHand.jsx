import React from 'react';
import PropTypes from 'prop-types';
import { rarityColors, elementSymbols } from '../cards';

export default function PlayerHand({ cards, player, isActive, selectedCardIndex, onSelectCard }) {
  if (!cards || cards.length === 0) return null;

  const borderColor = player === "P1" ? "border-blue-500" : "border-red-500";
  const glowColor = player === "P1" ? "shadow-blue-500/50" : "shadow-red-500/50";
  const activePulseColor = player === "P1" ? "shadow-blue-400" : "shadow-red-400";
  const bgColor = player === "P1" ? "#3B82F6" : "#EF4444";

  return (
    <div className={`bg-black/50 backdrop-blur-sm rounded-xl p-2 border-2 ${borderColor} flex flex-col h-full w-full transition-all duration-300
      ${isActive ? `shadow-2xl ${glowColor} border-4 ${activePulseColor}` : ''}`}>
      {/* Compact label */}
      <div className="text-white text-xs font-bold text-center flex-shrink-0 mb-1">
        {player === "P1" ? "🔵" : "🔴"}
      </div>
      <div className="flex flex-col gap-1.5 items-center justify-center flex-1">
          {cards.map((card, idx) => (
            <div
              key={idx}
              onClick={() => player === "P1" && isActive && onSelectCard && onSelectCard(idx)}
              className={`rounded-lg border-2 flex flex-col items-center justify-center text-white relative overflow-hidden transition-all duration-200 flex-shrink-0
                ${player === "P1" && isActive ? 'cursor-pointer hover:scale-105 hover:brightness-110' : ''}
                ${selectedCardIndex === idx ? 'ring-3 ring-yellow-400 ring-offset-1 ring-offset-black/50 scale-105 brightness-110' : 'border-white/30'}
              `}
              style={{ backgroundColor: bgColor, width: 'var(--tt-hand-card-w)', height: 'var(--tt-hand-card-h)' }}
            >
              {/* Background Image */}
              {card.image && (
                <div className="absolute inset-0 opacity-30">
                  <img 
                    src={card.image} 
                    alt={card.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Card Values - Symmetric (reserve space for name at bottom) */}
              <div className="absolute inset-x-0 top-0 bottom-5 z-10">
                {/* Top Center */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 text-sm font-bold bg-black/70 rounded px-1.5 py-0.5 shadow-md">{card.values.top}</div>

                {/* Left Center */}
                <div className="absolute left-1 top-1/2 -translate-y-1/2 text-sm font-bold bg-black/70 rounded px-1.5 py-0.5 shadow-md">{card.values.left}</div>

                {/* Right Center */}
                <div className="absolute right-1 top-1/2 -translate-y-1/2 text-sm font-bold bg-black/70 rounded px-1.5 py-0.5 shadow-md">{card.values.right}</div>

                {/* Bottom Center */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-sm font-bold bg-black/70 rounded px-1.5 py-0.5 shadow-md">{card.values.bottom}</div>

                {/* Element in Center */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs">{elementSymbols[card.element] || ''}</div>
              </div>
              
              {/* Name at very bottom */}
              <div className="absolute bottom-0.5 left-0 right-0 z-10 px-0.5">
                <div 
                  className="text-[8px] font-bold leading-tight text-center drop-shadow-lg bg-black/60 rounded py-0.5 px-0.5 truncate" 
                  style={{ color: rarityColors[card.rarity] || '#FFF' }}
                >
                  {card.name}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

PlayerHand.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object).isRequired,
  player: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  selectedCardIndex: PropTypes.number,
  onSelectCard: PropTypes.func,
};
