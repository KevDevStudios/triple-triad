import { computeCaptures } from "./gameModes";

export function getEmptyPositions(board) {
  const empties = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (!board[r][c]) {
        empties.push([r, c]);
      }
    }
  }
  return empties;
}

// Estimate how exposed a placement is: count adjacent empty cells where an
// opponent could threaten our card next turn. Used to mildly penalize risky
// placements on hard difficulty.
function exposureCount(board, r, c) {
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  let exposed = 0;
  for (const [dr, dc] of dirs) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr < 0 || nr > 2 || nc < 0 || nc > 2) continue;
    if (!board[nr][nc]) exposed += 1;
  }
  return exposed;
}

// Count how many of `card`'s sides face board edges (safer) vs. the interior.
function edgeSafety(r, c, card, reverse) {
  // In reverse mode, LOW values are strong — so edge safety still prefers
  // hiding HIGH sides on weak-by-mode orientations. We flip the heuristic.
  const weakSide = (v) => (reverse ? v >= 7 : v <= 3);
  let safety = 0;
  if (r === 0 && weakSide(card.values.top)) safety += 1;
  if (r === 2 && weakSide(card.values.bottom)) safety += 1;
  if (c === 0 && weakSide(card.values.left)) safety += 1;
  if (c === 2 && weakSide(card.values.right)) safety += 1;
  return safety;
}

function evaluateMove(board, card, r, c, player, rules) {
  const placed = { ...card, owner: player };
  const { finalBoard, flipMap, didSpecial } = computeCaptures(
    board,
    r,
    c,
    placed,
    player,
    rules
  );

  const captures = Object.keys(flipMap).length;

  // Base value: capturing enemy cards is the primary goal.
  let score = captures * 12;

  // Same/Plus activations are especially valuable (chain potential).
  if (didSpecial) score += 15;

  // Combo bonus: if more than a card's 4 direct neighbors got flipped,
  // we triggered a chain reaction.
  if (captures > 4) score += (captures - 4) * 6;

  // Positional heuristics.
  if (r === 1 && c === 1) score += 4; // center
  if ((r === 0 || r === 2) && (c === 0 || c === 2)) score += 2; // corners

  // Penalize exposure: fewer empty neighbors = harder for opponent to flip us.
  score -= exposureCount(finalBoard, r, c) * 1.2;

  // Edge safety: hiding weak sides on the board edge.
  score += edgeSafety(r, c, card, !!rules.reverse) * 2;

  return { score, captures, didSpecial };
}

/**
 * Returns the AI's chosen move as { r, c, cardIndex }.
 *
 * Backward-compatible: callers that spread the return into [r, c] still work
 * because the object also has numeric 0/1 indices via destructuring? No — we
 * must return an array-like. We return an array `[r, c]` with a `cardIndex`
 * property so both `const [r, c] = ...` and `move.cardIndex` work.
 */
export function getAIMove(board, difficulty, aiHand, rules = {}) {
  const empties = getEmptyPositions(board);
  if (empties.length === 0) return null;
  if (!aiHand || aiHand.length === 0) return null;

  const pickRandom = () => {
    const [r, c] = empties[Math.floor(Math.random() * empties.length)];
    const result = [r, c];
    result.cardIndex = 0; // play first card (matches pre-existing behavior)
    return result;
  };

  if (difficulty === "easy") {
    return pickRandom();
  }

  if (difficulty === "medium" && Math.random() < 0.5) {
    return pickRandom();
  }

  // Medium-strategic and Hard: evaluate placements.
  // Hard considers every (card, position) pairing; medium only considers the
  // next card in hand (kept closer to original behavior).
  const cardsToTry =
    difficulty === "hard"
      ? aiHand.map((card, idx) => ({ card, idx }))
      : [{ card: aiHand[0], idx: 0 }];

  let best = null;

  for (const { card, idx } of cardsToTry) {
    for (const [r, c] of empties) {
      const evalResult = evaluateMove(board, card, r, c, "P2", rules);
      if (
        !best ||
        evalResult.captures > best.eval.captures ||
        (evalResult.captures === best.eval.captures &&
          evalResult.score > best.eval.score)
      ) {
        best = { r, c, cardIndex: idx, eval: evalResult };
      }
    }
  }

  if (!best) return pickRandom();

  const result = [best.r, best.c];
  result.cardIndex = best.cardIndex;
  return result;
}
