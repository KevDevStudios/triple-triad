import React from 'react';
import PropTypes from 'prop-types';
import { elementColors, rarityColors } from '../cards';

export default function PlayerHand({ cards, player, isActive }) {
  if (!cards || cards.length === 0) return null;

  const borderColor = player === "P1" ? "border-blue-500" : "border-red-500";
  const glowColor = player === "P1" ? "shadow-blue-500/50" : "shadow-red-500/50";

  return (
    <div className={`fixed ${player === "P1" ? "bottom-4 left-4" : "bottom-4 right-4"} z-30`}>
      <div className={`bg-black/70 backdrop-blur-sm rounded-lg p-3 border-2 ${borderColor} ${isActive ? 'shadow-lg ' + glowColor : ''}`}>
        <div className="text-white text-sm font-bold mb-2 text-center">
          {player === "P1" ? "🔵 Your Hand" : "🔴 AI Hand"}
        </div>
        <div className="flex gap-2">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="w-12 h-16 rounded border-2 border-white/30 flex flex-col items-center justify-center text-white text-[8px] p-1"
              style={{
                background: `linear-gradient(135deg, ${elementColors[card.element] || '#666'} 0%, #000 100%)`
              }}
            >
              <div className="font-bold" style={{ color: rarityColors[card.rarity] || '#FFF' }}>
                {card.name.substring(0, 6)}
              </div>
              <div className="text-[6px] mt-0.5">{card.element}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

PlayerHand.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object).isRequired,
  player: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
};
