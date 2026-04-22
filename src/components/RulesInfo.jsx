import React, { useState } from "react";
import PropTypes from "prop-types";

const RULE_DETAILS = [
  {
    key: "reverse",
    emoji: "🔄",
    title: "Reverse",
    desc: "Lower values win sides instead of higher. Small numbers become powerful.",
  },
  {
    key: "same",
    emoji: "🟰",
    title: "Same",
    desc: "If 2+ of your placed card's sides match their neighbors' touching values, all matching enemy cards flip — and can combo further.",
  },
  {
    key: "plus",
    emoji: "➕",
    title: "Plus",
    desc: "If 2+ adjacent pairs share the same SUM (your side + neighbor's side), those enemy cards flip — and can combo further.",
  },
  {
    key: "suddenDeath",
    emoji: "⏱️",
    title: "Sudden Death",
    desc: "If the board ends in a tie, both players redraw from their currently owned cards and replay — up to 3 rounds.",
  },
];

export default function RulesInfo({ modeConfig }) {
  const [open, setOpen] = useState(false);
  if (!modeConfig) return null;
  const rules = modeConfig.rules || {};
  const activeRules = RULE_DETAILS.filter((r) => rules[r.key]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close rules" : "Show rules"}
        title="Rules"
        className={`backdrop-blur-md text-white font-bold py-2 px-3 rounded-xl shadow-lg border-2 transition-all duration-200 ${
          open
            ? "bg-gradient-to-br from-purple-600 to-indigo-700 border-white/40"
            : "bg-gradient-to-br from-purple-800/90 to-indigo-900/90 border-white/15 hover:border-white/40 hover:scale-105"
        }`}
      >
        <span aria-hidden className="text-lg">📖</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 w-[300px] rounded-2xl border border-white/15 bg-gradient-to-br from-purple-900/95 to-indigo-900/95 shadow-2xl backdrop-blur-md p-4 text-white">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl" aria-hidden>{modeConfig.emoji}</span>
              <div>
                <div className="text-xs uppercase tracking-wider text-white/60">
                  Active Mode
                </div>
                <div className="text-lg font-bold leading-tight">
                  {modeConfig.label}
                </div>
              </div>
            </div>
            <p className="text-sm text-white/80 mb-3">{modeConfig.desc}</p>

            <div className="space-y-2 mb-3">
              <div className="text-[11px] uppercase tracking-wider text-yellow-300/90 font-semibold">
                Base Rules
              </div>
              <ul className="text-xs text-white/80 list-disc list-inside space-y-1">
                <li>Each player starts with 5 cards.</li>
                <li>Place cards on a 3×3 board, one per turn.</li>
                <li>
                  {rules.reverse
                    ? "LOWER touching value captures (Reverse)."
                    : "HIGHER touching value captures."}
                </li>
                <li>Player with more owned cards at game end wins.</li>
              </ul>
            </div>

            {activeRules.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] uppercase tracking-wider text-yellow-300/90 font-semibold">
                  Special Rules
                </div>
                <ul className="space-y-2">
                  {activeRules.map((r) => (
                    <li
                      key={r.key}
                      className="bg-white/5 border border-white/10 rounded-lg p-2"
                    >
                      <div className="flex items-center gap-1.5 text-sm font-semibold">
                        <span aria-hidden>{r.emoji}</span>
                        <span>{r.title}</span>
                      </div>
                      <div className="text-xs text-white/75 mt-0.5">
                        {r.desc}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

RulesInfo.propTypes = {
  modeConfig: PropTypes.shape({
    label: PropTypes.string.isRequired,
    emoji: PropTypes.string,
    desc: PropTypes.string,
    rules: PropTypes.object,
  }),
};
