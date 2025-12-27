import React, { useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";

function getPlayerLabel(player, mode) {
  if (mode === "PVE") {
    return player === "P1" ? "You" : "AI";
  }
  return player === "P1" ? "Player 1" : "Player 2";
}

export default function CoinFlipOverlay({
  mode,
  phase,
  target,
  onFlip,
}) {
  const coinButtonRef = useRef(null);

  const canFlip = phase === "awaiting";
  const isFlipping = phase === "flipping";
  const isRevealed = phase === "revealed";

  const finalRot = target === "P2" ? "180deg" : "0deg";
  const winnerLabel = target ? getPlayerLabel(target, mode) : "";

  const headsLabel = useMemo(() => getPlayerLabel("P1", mode), [mode]);
  const tailsLabel = useMemo(() => getPlayerLabel("P2", mode), [mode]);

  useEffect(() => {
    if (phase === "awaiting") {
      // Give React a tick to render before focusing.
      const t = setTimeout(() => {
        coinButtonRef.current?.focus?.();
      }, 0);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const statusText =
    (canFlip && "Tap the coin to flip (or wait to auto-flip).") ||
    (isFlipping && "Flipping…") ||
    (isRevealed && `${winnerLabel} goes first!`) ||
    "";

  if (phase === "idle") return null;

  return (
    <div
      data-testid="coinflip-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Coin flip"
    >
      <div className="w-full max-w-md rounded-3xl border border-white/15 bg-gradient-to-br from-purple-900/90 to-indigo-900/90 shadow-2xl backdrop-blur-md p-6 text-center">
        <div className="text-yellow-300 font-bold text-lg">Coin Flip</div>
        <div className="mt-1 text-white/80 text-sm" aria-live="polite">
          {statusText}
        </div>

        <div className="mt-6 flex items-center justify-center">
          <button
            ref={coinButtonRef}
            type="button"
            onClick={canFlip ? onFlip : undefined}
            disabled={!canFlip}
            className={`tt-coin rounded-full transition-transform duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300/40 ${
              canFlip ? "cursor-pointer hover:scale-[1.03] active:scale-[0.98]" : "cursor-default"
            }`}
            aria-label={canFlip ? "Flip coin" : "Coin"}
          >
            <div
              className={`tt-coin-inner ${isFlipping ? "tt-coin-flipping" : ""}`}
              style={{ "--tt-coin-final-rot": finalRot }}
            >
              <div className="tt-coin-face tt-coin-front tt-coin-metal border-2 border-white/30 shadow-xl">
                <div className="h-full w-full flex flex-col items-center justify-center">
                  <div className="text-xs font-bold tracking-[0.25em] text-white/80">HEADS</div>
                  <div className="mt-2 text-4xl">🔵</div>
                  <div className="mt-2 text-xs font-bold text-white">{headsLabel}</div>
                </div>
              </div>
              <div className="tt-coin-face tt-coin-back tt-coin-metal border-2 border-white/30 shadow-xl">
                <div className="h-full w-full flex flex-col items-center justify-center">
                  <div className="text-xs font-bold tracking-[0.25em] text-white/80">TAILS</div>
                  <div className="mt-2 text-4xl">🔴</div>
                  <div className="mt-2 text-xs font-bold text-white">{tailsLabel}</div>
                </div>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-3">
          <button
            type="button"
            onClick={onFlip}
            disabled={!canFlip}
            className={`px-4 py-2 rounded-xl font-bold border-2 transition-all duration-300 ${
              canFlip
                ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-white/20 hover:border-white/40"
                : "bg-white/10 text-white/50 border-white/10"
            }`}
          >
            Flip
          </button>
          <div className="text-xs text-white/60">
            Heads: <span className="text-white/90 font-semibold">{headsLabel}</span> • Tails:{" "}
            <span className="text-white/90 font-semibold">{tailsLabel}</span>
          </div>
          {isRevealed && (
            <div className="mt-1 text-sm font-bold text-yellow-200">
              {winnerLabel} starts
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

CoinFlipOverlay.propTypes = {
  mode: PropTypes.oneOf(["PVE", "PVP"]).isRequired,
  phase: PropTypes.oneOf(["idle", "awaiting", "flipping", "revealed"]).isRequired,
  target: PropTypes.oneOf(["P1", "P2"]),
  onFlip: PropTypes.func.isRequired,
};
