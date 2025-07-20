export function getFlippableNeighbors(board, r, c, card, player) {
  const directions = [
    [-1, 0, "top", "bottom"],
    [1, 0, "bottom", "top"],
    [0, -1, "left", "right"],
    [0, 1, "right", "left"]
  ];
  const flips = {};
  for (const [dr, dc, myDir, theirDir] of directions) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr < 0 || nr > 2 || nc < 0 || nc > 2) continue;
    const neighbor = board[nr][nc];
    if (neighbor && neighbor.owner !== player) {
      if (card.values[myDir] > neighbor.values[theirDir]) {
        flips[`\${nr}-\${nc}`] = { r: nr, c: nc };
      }
    }
  }
  return flips;
}
