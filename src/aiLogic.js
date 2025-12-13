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

function evaluatePosition(board, card, r, c, player) {
  const directions = [
    { dr: -1, dc: 0, own: "top", opp: "bottom" },
    { dr: 1, dc: 0, own: "bottom", opp: "top" },
    { dr: 0, dc: -1, own: "left", opp: "right" },
    { dr: 0, dc: 1, own: "right", opp: "left" },
  ];
  
  let score = 0;
  let captures = 0;
  
  for (const { dr, dc, own, opp } of directions) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr < 0 || nr > 2 || nc < 0 || nc > 2) continue;
    
    const neighbor = board[nr][nc];
    if (neighbor && neighbor.owner !== player) {
      if (card.values[own] > neighbor.values[opp]) {
        captures++;
        score += 10;
      } else if (card.values[own] === neighbor.values[opp]) {
        score += 2;
      } else {
        score -= 3;
      }
    } else if (!neighbor) {
      score += 1;
    }
  }
  
  // Bonus for center position
  if (r === 1 && c === 1) score += 5;
  
  // Bonus for corner positions
  if ((r === 0 || r === 2) && (c === 0 || c === 2)) score += 2;
  
  return { score, captures };
}

export function getAIMove(board, difficulty, aiHand) {
  const empties = getEmptyPositions(board);
  if (empties.length === 0) return null;
  
  if (difficulty === "easy") {
    return empties[Math.floor(Math.random() * empties.length)];
  }
  
  if (difficulty === "medium") {
    // 50% random, 50% strategic
    if (Math.random() < 0.5) {
      return empties[Math.floor(Math.random() * empties.length)];
    }
  }
  
  // Hard mode or strategic medium mode
  if (!aiHand || aiHand.length === 0) {
    return empties[Math.floor(Math.random() * empties.length)];
  }
  
  const nextCard = aiHand[0];
  let bestMove = empties[0];
  let bestEval = { score: -999, captures: 0 };
  
  for (const [r, c] of empties) {
    const evaluation = evaluatePosition(board, nextCard, r, c, "P2");
    
    if (evaluation.captures > bestEval.captures || 
        (evaluation.captures === bestEval.captures && evaluation.score > bestEval.score)) {
      bestEval = evaluation;
      bestMove = [r, c];
    }
  }
  
  return bestMove;
}
