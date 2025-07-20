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

export function getAIMove(board, difficulty) {
  const empties = getEmptyPositions(board);
  if (empties.length === 0) return null;
  if (difficulty === "easy") return empties[Math.floor(Math.random() * empties.length)];
  if (difficulty === "medium") return empties.sort(() => 0.5 - Math.random())[0];
  if (difficulty === "hard") return empties[0];
  return empties[0];
}
