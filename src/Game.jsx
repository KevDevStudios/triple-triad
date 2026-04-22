// Game.jsx
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import useGameLogic from "./hooks/useGameLogic";
import GameBoard from "./components/GameBoard";
import OptionsMenu from "./components/OptionsMenu";
import PlayerHand from "./components/PlayerHand";
import Confetti from "./components/Confetti";
import MusicControl from "./components/MusicControl";
import CoinFlipOverlay from "./components/CoinFlipOverlay";
import RulesInfo from "./components/RulesInfo";

export default function Game({ mode, difficulty, gameMode, music, onBackToStart }) {
  const {
    board,
    turn,
    scores,
    message,
    flipMap,
    hands,
    handleCellClick,
    moveInProgress,
    startNewGameWithCoinFlip,
    coinFlip,
    triggerCoinFlip,
    selectedCardIndex,
    selectCard,
    suddenDeathRound,
    modeConfig,
  } = useGameLogic({ mode, difficulty, gameMode });

  const [isMusicOpen, setIsMusicOpen] = useState(false);

  const [turnTimer, setTurnTimer] = useState(30);

  const startGame = () => {
    startNewGameWithCoinFlip();
    setTurnTimer(30);
  };

  // Auto-place card when timer hits 0
  const handleAutoPlace = () => {
    if (!turn || moveInProgress) return;

    const currentHand = hands[turn];
    if (currentHand.length === 0) return;

    // Find first available empty cell
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (!board[r][c]) {
          // For P1, select random card if none selected
          if (turn === "P1" && selectedCardIndex === null) {
            const randomIdx = Math.floor(Math.random() * currentHand.length);
            handleCellClick(r, c, turn, randomIdx);
          } else {
            handleCellClick(r, c);
          }
          return;
        }
      }
    }
  };

  useEffect(() => {
    startGame();
    // Only run once on mount to initialize the game
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (!turn || moveInProgress) return;

    setTurnTimer(30);
    const interval = setInterval(() => {
      setTurnTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoPlace();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn, moveInProgress]);
  const guardedClick = (r, c) => {
    if (moveInProgress || (mode === "PVE" && turn === "P2"))
      return;
    handleCellClick(r, c);
  };

  const isGameOver =
    (!turn && message.toLowerCase().includes("wins")) ||
    message.toLowerCase().includes("tie");

  const handleRestart = () => {
    startGame();
  };

  // Mode-aware player labels
  const p1Label = mode === "PVE" ? "You" : "Player 1";
  const p2Label = mode === "PVE" ? "AI" : "Player 2";

  const isTie = message.toLowerCase().includes("tie");
  const p1Won = message.includes("Player 1");
  const resultTitle = isTie
    ? "It's a Tie!"
    : p1Won
    ? (mode === "PVE" ? "Victory!" : "Player 1 Wins!")
    : (mode === "PVE" ? "Defeat" : "Player 2 Wins!");
  const resultEmoji = isTie ? "🤝" : p1Won ? "🏆" : (mode === "PVE" ? "💀" : "🎖️");

  // Only allow empty-cell highlight when it is the human's turn and they have a selected card
  const canHighlightEmpty =
    turn === "P1" && !moveInProgress && selectedCardIndex !== null;

  return (
    <div className="h-dvh flex flex-col text-white relative overflow-hidden">
      <CoinFlipOverlay
        mode={mode}
        phase={coinFlip.phase}
        target={coinFlip.target}
        onFlip={() => triggerCoinFlip()}
      />
      {/* Header with Scores */}
      <div className="px-4 py-3 bg-gradient-to-r from-blue-900/80 via-purple-900/80 to-indigo-900/80 backdrop-blur-md border-b border-white/15 shadow-xl">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          {/* P1 score pill */}
          <div className="justify-self-start flex items-center gap-2 bg-blue-500/15 border border-blue-400/30 rounded-full px-3 py-1.5 shadow-inner">
            <span className="text-lg" aria-hidden>🔵</span>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] uppercase tracking-wider text-blue-200/80 font-semibold">{p1Label}</span>
              <span className="text-lg font-bold text-blue-100 tabular-nums">{scores.P1}</span>
            </div>
          </div>

          {/* VS badge */}
          <div className="justify-self-center flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-black font-black text-sm flex items-center justify-center shadow-lg ring-2 ring-white/20">
              VS
            </div>
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-semibold uppercase tracking-wider text-white/90"
              title={modeConfig?.desc}
            >
              <span aria-hidden>{modeConfig?.emoji}</span>
              <span>{modeConfig?.label}</span>
              {suddenDeathRound > 0 && (
                <span className="ml-1 px-1 rounded bg-red-500/70 text-white text-[9px]">
                  SD {suddenDeathRound}
                </span>
              )}
            </div>
          </div>

          {/* P2 + controls */}
          <div className="justify-self-end flex items-center gap-2">
            <div className="flex items-center gap-2 bg-red-500/15 border border-red-400/30 rounded-full px-3 py-1.5 shadow-inner">
              <div className="flex flex-col leading-none items-end">
                <span className="text-[10px] uppercase tracking-wider text-red-200/80 font-semibold">{p2Label}</span>
                <span className="text-lg font-bold text-red-100 tabular-nums">{scores.P2}</span>
              </div>
              <span className="text-lg" aria-hidden>🔴</span>
            </div>

            {/* Rules Info */}
            <RulesInfo modeConfig={modeConfig} />

            {/* Music Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMusicOpen((v) => !v)}
                aria-label={isMusicOpen ? 'Close music panel' : 'Open music panel'}
                className={`backdrop-blur-md text-white font-bold py-2 px-3 rounded-xl shadow-lg border-2 transition-all duration-200 ${
                  isMusicOpen
                    ? 'bg-gradient-to-br from-purple-600 to-indigo-700 border-white/40'
                    : 'bg-gradient-to-br from-purple-800/90 to-indigo-900/90 border-white/15 hover:border-white/40 hover:scale-105'
                }`}
                title={isMusicOpen ? 'Close Music' : 'Open Music'}
              >
                <span aria-hidden className="text-lg">{music.isPlaying ? '🔊' : '♪'}</span>
              </button>

              {isMusicOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMusicOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 z-50">
                    <MusicControl
                      isPlaying={music.isPlaying}
                      onToggle={music.toggleMusic}
                      volume={music.volume}
                      onVolumeChange={music.changeVolume}
                      tracks={music.tracks}
                      trackId={music.trackId}
                      onTrackChange={music.changeTrack}
                      containerClassName="w-[280px] rounded-2xl border border-white/15 bg-gradient-to-br from-purple-900/95 to-indigo-900/95 shadow-2xl backdrop-blur-md"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Options Menu */}
            <OptionsMenu
              onRestart={handleRestart}
              onBackToStart={onBackToStart}
            />
          </div>
        </div>
      </div>

      {/* Small screens: compact opponent strip + horizontal P1 hand */}
      <div className="lg:hidden shrink-0 px-4 pt-2 flex flex-col gap-2">
        <div className="flex items-center justify-center gap-2 text-xs text-white/80">
          <span aria-hidden>🔴</span>
          <span className="font-semibold">{p2Label}</span>
          <span className="text-white/50">•</span>
          <span className="text-white/70">{hands.P2?.length ?? 0} cards left</span>
          {turn === "P2" && (
            <span className="ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/25 border border-red-300/40 text-[10px] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-red-300 animate-pulse" aria-hidden />
              thinking
            </span>
          )}
        </div>
      </div>

      {/* Small screens: show P1 hand horizontally */}
      <div className="shrink-0 px-4 pt-2 lg:hidden flex items-center justify-center">
        <div className="w-full max-w-[520px]">
          <PlayerHand
            cards={hands.P1}
            player="P1"
            isActive={turn === "P1"}
            selectedCardIndex={turn === "P1" ? selectedCardIndex : null}
            onSelectCard={selectCard}
            label={p1Label}
            orientation="horizontal"
          />
        </div>
      </div>

      {/* Main play area */}
      <div className="flex-1 min-h-0 flex items-center justify-center px-4 py-4">
        <div className="w-full max-w-7xl mx-auto h-full flex items-center justify-center">
          <div className="w-full h-full grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] gap-8 items-center">
            {/* Large screens: left hand */}
            <div className="hidden lg:flex w-full self-center justify-center">
              <div className="w-fit">
                <PlayerHand
                  cards={hands.P1}
                  player="P1"
                  isActive={turn === "P1"}
                  selectedCardIndex={turn === "P1" ? selectedCardIndex : null}
                  onSelectCard={selectCard}
                  label={p1Label}
                />
              </div>
            </div>

            <div className="flex items-center justify-center w-full self-center">
              <GameBoard
                board={board}
                flipMap={flipMap}
                onCellClick={guardedClick}
                highlightEmpty={canHighlightEmpty}
              />
            </div>

            {/* Large screens: right hand */}
            <div className="hidden lg:flex w-full self-center justify-center">
              <div className="w-fit">
                <PlayerHand
                  cards={hands.P2}
                  player="P2"
                  isActive={turn === "P2"}
                  label={p2Label}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Turn/Timer Bar */}
      {turn && !isGameOver && (
        <div className="shrink-0 flex justify-center pb-3 pt-1 px-4">
          <div className={`bg-black/60 backdrop-blur-md rounded-full px-5 py-2 border flex items-center gap-3 sm:gap-4 shadow-lg transition-colors duration-300 ${
            turn === "P1" ? 'border-blue-400/40' : 'border-red-400/40'
          }`}>
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <span className={`w-2 h-2 rounded-full animate-pulse ${turn === "P1" ? 'bg-blue-400' : 'bg-red-400'}`} aria-hidden />
              <span>
                {turn === "P1" ? `${p1Label}'s Turn` : `${p2Label}'s Turn`}
              </span>
            </div>
            <div className="w-24 sm:w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-[width,background-color] duration-500 ease-linear ${
                  turnTimer <= 5 ? 'bg-red-500' :
                  turnTimer <= 10 ? 'bg-yellow-400' :
                  'bg-emerald-400'
                }`}
                style={{ width: `${(turnTimer / 30) * 100}%` }}
              />
            </div>
            <div className={`text-sm font-bold tabular-nums transition-colors duration-300 min-w-[28px] text-right ${
              turnTimer <= 5 ? 'text-red-400 animate-pulse' :
              turnTimer <= 10 ? 'text-yellow-300' :
              'text-emerald-300'
            }`}>
              {turnTimer}s
            </div>
          </div>
        </div>
      )}

      {isGameOver && (
        <>
          <Confetti />
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-[fade-in_200ms_ease-out]">
            <div className="bg-gradient-to-br from-purple-800 to-indigo-900 text-white p-8 rounded-2xl shadow-2xl text-center space-y-5 border border-yellow-400/60 ring-2 ring-yellow-400/20 max-w-md w-full">
              <div className="text-7xl" aria-hidden>{resultEmoji}</div>
              <h2 className="text-4xl font-extrabold tracking-tight">{resultTitle}</h2>
              <div className="flex items-center justify-center gap-4 text-lg">
                <div className="flex items-center gap-1.5 bg-blue-500/15 border border-blue-400/30 rounded-full px-3 py-1">
                  <span aria-hidden>🔵</span>
                  <span className="font-bold tabular-nums">{scores.P1}</span>
                </div>
                <span className="text-white/50">—</span>
                <div className="flex items-center gap-1.5 bg-red-500/15 border border-red-400/30 rounded-full px-3 py-1">
                  <span className="font-bold tabular-nums">{scores.P2}</span>
                  <span aria-hidden>🔴</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={handleRestart}
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-bold py-3 px-6 rounded-full text-base shadow-lg transition-all duration-300 transform hover:scale-[1.03]"
                >
                  🎮 Play Again
                </button>
                <button
                  onClick={onBackToStart}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-full text-base border border-white/20 transition-all duration-300"
                >
                  🏠 Main Menu
                </button>
              </div>
            </div>
          </div>
        </>
      )}


    </div>
  );
}

Game.propTypes = {
  mode: PropTypes.oneOf(["PVE", "PVP"]).isRequired,
  difficulty: PropTypes.oneOf(["easy", "medium", "hard"]).isRequired,
  gameMode: PropTypes.string,
  music: PropTypes.shape({
    isPlaying: PropTypes.bool.isRequired,
    toggleMusic: PropTypes.func.isRequired,
    volume: PropTypes.number.isRequired,
    changeVolume: PropTypes.func.isRequired,
    tracks: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        file: PropTypes.string.isRequired,
      })
    ).isRequired,
    trackId: PropTypes.string.isRequired,
    changeTrack: PropTypes.func.isRequired,
  }).isRequired,
  onBackToStart: PropTypes.func.isRequired,
};
