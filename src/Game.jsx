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

export default function Game({ mode, difficulty, music, onBackToStart }) {
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
  } = useGameLogic({ mode, difficulty });

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

  return (
    <div className="h-dvh flex flex-col text-white relative overflow-hidden">
      <CoinFlipOverlay
        mode={mode}
        phase={coinFlip.phase}
        target={coinFlip.target}
        onFlip={() => triggerCoinFlip()}
      />
      {/* Header with Scores */}
      <div className="px-4 py-3 bg-gradient-to-r from-blue-900/80 via-purple-900/80 to-indigo-900/80 backdrop-blur-sm border-b-2 border-white/20 shadow-xl">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-3 lg:grid-cols-[300px_1fr_300px] items-center gap-3">
          <div className="flex items-center gap-2 justify-self-start lg:justify-self-center">
            <span className="text-xl">🔵</span>
            <span className="text-sm sm:text-base font-bold">
              P1: <span className="text-blue-300">{scores.P1}</span>
            </span>
          </div>

          <div className="text-yellow-300 text-sm sm:text-base font-bold justify-self-center text-center">
            VS
          </div>

          {/* Large screens: center the score within the right hand column, keep controls on the right */}
          <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center justify-self-center w-full">
            <div />

            <div className="flex items-center gap-2 justify-self-center">
              <span className="text-sm sm:text-base font-bold">
                P2: <span className="text-red-300">{scores.P2}</span>
              </span>
              <span className="text-xl">🔴</span>
            </div>

            <div className="flex items-center gap-2 justify-self-end">
              {/* Music Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsMusicOpen((v) => !v)}
                  className="bg-gradient-to-br from-purple-800/90 to-indigo-900/90 backdrop-blur-md text-white font-bold py-2 px-3 rounded-lg shadow-lg border-2 border-white/20 hover:border-white/40 transition-all duration-300"
                  title={isMusicOpen ? 'Close Music' : 'Open Music'}
                >
                  <span aria-hidden className="text-lg">♪</span>
                </button>

                {isMusicOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsMusicOpen(false)}
                    />
                    {/* Music Panel */}
                    <div className="absolute right-0 top-full mt-2 z-50">
                      <MusicControl
                        isPlaying={music.isPlaying}
                        onToggle={music.toggleMusic}
                        volume={music.volume}
                        onVolumeChange={music.changeVolume}
                        tracks={music.tracks}
                        trackId={music.trackId}
                        onTrackChange={music.changeTrack}
                        containerClassName="w-[280px] rounded-2xl border border-white/15 bg-gradient-to-br from-purple-900/90 to-indigo-900/90 shadow-xl backdrop-blur-md"
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

          {/* Small screens: keep P2 score + controls together */}
          <div className="flex lg:hidden items-center gap-3 justify-self-end">
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold">
                P2: <span className="text-red-300">{scores.P2}</span>
              </span>
              <span className="text-xl">🔴</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Music Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsMusicOpen((v) => !v)}
                  className="bg-gradient-to-br from-purple-800/90 to-indigo-900/90 backdrop-blur-md text-white font-bold py-2 px-3 rounded-lg shadow-lg border-2 border-white/20 hover:border-white/40 transition-all duration-300"
                  title={isMusicOpen ? 'Close Music' : 'Open Music'}
                >
                  <span aria-hidden className="text-lg">♪</span>
                </button>

                {isMusicOpen && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-30"
                      onClick={() => setIsMusicOpen(false)}
                    />
                    {/* Music Panel */}
                    <div className="absolute right-0 top-full mt-2 z-40">
                      <MusicControl
                        isPlaying={music.isPlaying}
                        onToggle={music.toggleMusic}
                        volume={music.volume}
                        onVolumeChange={music.changeVolume}
                        tracks={music.tracks}
                        trackId={music.trackId}
                        onTrackChange={music.changeTrack}
                        containerClassName="w-[280px] rounded-2xl border border-white/15 bg-gradient-to-br from-purple-900/90 to-indigo-900/90 shadow-xl backdrop-blur-md"
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
      </div>

      {/* Small screens: show P1 hand vertically */}
      <div className="shrink-0 px-4 pt-3 lg:hidden flex items-center justify-center">
        <div className="w-full max-w-[280px]">
          <PlayerHand 
            cards={hands.P1} 
            player="P1" 
            isActive={turn === "P1"} 
            selectedCardIndex={turn === "P1" ? selectedCardIndex : null}
            onSelectCard={selectCard}
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
                />
              </div>
            </div>

            <div className="flex items-center justify-center w-full self-center">
              <GameBoard board={board} flipMap={flipMap} onCellClick={guardedClick} />
            </div>

            {/* Large screens: right hand */}
            <div className="hidden lg:flex w-full self-center justify-center">
              <div className="w-fit">
                <PlayerHand 
                  cards={hands.P2} 
                  player="P2" 
                  isActive={turn === "P2"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Timer Bar - Compact */}
      {turn && (
        <div className="shrink-0 flex justify-center py-2">
          <div className="bg-black/60 backdrop-blur-md rounded-full px-6 py-2 border border-white/20 flex items-center gap-4">
            <div className="text-white font-bold text-sm">
              {turn === "P1" ? "🔵 Your Turn" : "🔴 AI's Turn"}
            </div>
            <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-linear ${
                  turnTimer <= 5 ? 'bg-red-500' :
                  turnTimer <= 10 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${(turnTimer / 30) * 100}%` }}
              />
            </div>
            <div className={`text-lg font-bold transition-all duration-300 ${
              turnTimer <= 5 ? 'text-red-400 animate-pulse' :
              turnTimer <= 10 ? 'text-yellow-400' :
              'text-green-400'
            }`}>
              {turnTimer}s
            </div>
          </div>
        </div>
      )}

      {isGameOver && (
        <>
          <Confetti />
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-purple-800 to-indigo-900 text-white p-8 rounded-2xl shadow-2xl text-center space-y-6 border-4 border-yellow-400 max-w-md">
              <h2 className="text-4xl font-bold animate-pulse">{message}</h2>
              <div className="text-6xl">
                {message.includes("Player 1") ? "🏆" : message.includes("Player 2") ? "🎖️" : "🤝"}
              </div>
              <div className="text-xl">
                Final Score: {scores.P1} - {scores.P2}
              </div>
              <button
                onClick={handleRestart}
                className="mt-4 w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-bold py-3 px-6 rounded-full text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                🎮 Play Again
              </button>
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
