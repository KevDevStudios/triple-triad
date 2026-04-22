// Game modes and rule variations for Triple Triad.
// Each mode toggles a combination of rules used by the capture logic in useGameLogic.

export const GAME_MODES = [
  {
    id: "classic",
    label: "Classic",
    emoji: "🎴",
    desc: "Standard rules — higher value wins the side.",
    rules: { reverse: false, same: false, plus: false, suddenDeath: false },
  },
  {
    id: "suddenDeath",
    label: "Sudden Death",
    emoji: "⏱️",
    desc: "Ties replay with current card ownership (up to 3 rounds).",
    rules: { reverse: false, same: false, plus: false, suddenDeath: true },
  },
  {
    id: "reverse",
    label: "Reverse",
    emoji: "🔄",
    desc: "Lower value wins the side instead of higher.",
    rules: { reverse: true, same: false, plus: false, suddenDeath: false },
  },
  {
    id: "same",
    label: "Same",
    emoji: "🟰",
    desc: "Match 2+ sides' values to flip them all, with combo.",
    rules: { reverse: false, same: true, plus: false, suddenDeath: false },
  },
  {
    id: "plus",
    label: "Plus",
    emoji: "➕",
    desc: "2+ sides with equal sums flip together, with combo.",
    rules: { reverse: false, same: false, plus: true, suddenDeath: false },
  },
  {
    id: "chaos",
    label: "Chaos",
    emoji: "🌀",
    desc: "Reverse + Same + Plus + Sudden Death. Good luck.",
    rules: { reverse: true, same: true, plus: true, suddenDeath: true },
  },
];

export const DEFAULT_MODE_ID = "classic";

export function getModeById(id) {
  return GAME_MODES.find((m) => m.id === id) || GAME_MODES[0];
}

const DIRECTIONS = [
  { dr: -1, dc: 0, own: "top", opp: "bottom", dir: "vertical" },
  { dr: 1, dc: 0, own: "bottom", opp: "top", dir: "vertical" },
  { dr: 0, dc: -1, own: "left", opp: "right", dir: "horizontal" },
  { dr: 0, dc: 1, own: "right", opp: "left", dir: "horizontal" },
];

/**
 * Compute the set of cells flipped when `card` is placed at (r, c) for `player`
 * under the given rule set. Supports regular captures, Same, Plus, and Combo.
 *
 * Returns:
 *   {
 *     flipMap: { "r-c": "flip-vertical" | "flip-horizontal" },
 *     finalBoard: the board with all captures applied,
 *     didFlip: boolean,
 *     didSpecial: boolean (Same/Plus triggered)
 *   }
 */
export function computeCaptures(board, r, c, card, player, rules = {}) {
  const { reverse = false, same = false, plus = false } = rules;
  const beats = reverse ? (a, b) => a < b : (a, b) => a > b;

  const workBoard = board.map((row) => row.slice());
  workBoard[r][c] = card;

  const sides = DIRECTIONS.map((d) => {
    const nr = r + d.dr;
    const nc = c + d.dc;
    if (nr < 0 || nr > 2 || nc < 0 || nc > 2) return null;
    const neighbor = workBoard[nr][nc];
    if (!neighbor) return null;
    return {
      nr,
      nc,
      d,
      neighbor,
      own: card.values[d.own],
      opp: neighbor.values[d.opp],
    };
  }).filter(Boolean);

  const flipped = new Map(); // "r-c" -> flip animation class
  const specialTargets = new Set(); // keys flipped via Same/Plus (seed combo)

  // Regular capture via value comparison
  for (const s of sides) {
    if (s.neighbor.owner !== player && beats(s.own, s.opp)) {
      const key = `${s.nr}-${s.nc}`;
      flipped.set(key, s.d.dir === "vertical" ? "flip-vertical" : "flip-horizontal");
    }
  }

  // Same rule: 2+ sides with matching values -> flip enemy matches
  if (same) {
    const matches = sides.filter((s) => s.own === s.opp);
    if (matches.length >= 2 && matches.some((s) => s.neighbor.owner !== player)) {
      for (const s of matches) {
        if (s.neighbor.owner !== player) {
          const key = `${s.nr}-${s.nc}`;
          if (!flipped.has(key)) {
            flipped.set(
              key,
              s.d.dir === "vertical" ? "flip-vertical" : "flip-horizontal"
            );
          }
          specialTargets.add(key);
        }
      }
    }
  }

  // Plus rule: 2+ sides whose (own + opp) sums are equal -> flip enemies
  if (plus) {
    const groups = new Map();
    for (const s of sides) {
      const sum = s.own + s.opp;
      if (!groups.has(sum)) groups.set(sum, []);
      groups.get(sum).push(s);
    }
    for (const group of groups.values()) {
      if (group.length >= 2 && group.some((s) => s.neighbor.owner !== player)) {
        for (const s of group) {
          if (s.neighbor.owner !== player) {
            const key = `${s.nr}-${s.nc}`;
            if (!flipped.has(key)) {
              flipped.set(
                key,
                s.d.dir === "vertical" ? "flip-vertical" : "flip-horizontal"
              );
            }
            specialTargets.add(key);
          }
        }
      }
    }
  }

  // Apply initial flips to the working board
  for (const key of flipped.keys()) {
    const [fr, fc] = key.split("-").map(Number);
    workBoard[fr][fc] = { ...workBoard[fr][fc], owner: player };
  }

  // Combo: Same/Plus flipped cards trigger regular captures on THEIR neighbors.
  // Those captured cards can also trigger further regular-capture combos.
  const queue = [...specialTargets];
  while (queue.length) {
    const key = queue.shift();
    const [fr, fc] = key.split("-").map(Number);
    const flippedCard = workBoard[fr][fc];
    for (const d of DIRECTIONS) {
      const nr = fr + d.dr;
      const nc = fc + d.dc;
      if (nr < 0 || nr > 2 || nc < 0 || nc > 2) continue;
      const n = workBoard[nr][nc];
      if (!n || n.owner === player) continue;
      if (beats(flippedCard.values[d.own], n.values[d.opp])) {
        const nkey = `${nr}-${nc}`;
        if (!flipped.has(nkey)) {
          flipped.set(
            nkey,
            d.dir === "vertical" ? "flip-vertical" : "flip-horizontal"
          );
          workBoard[nr][nc] = { ...n, owner: player };
          queue.push(nkey);
        }
      }
    }
  }

  const flipMap = {};
  for (const [k, v] of flipped.entries()) flipMap[k] = v;

  return {
    flipMap,
    finalBoard: workBoard,
    didFlip: flipped.size > 0,
    didSpecial: specialTargets.size > 0,
  };
}
