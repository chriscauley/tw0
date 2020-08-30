export default (action1, action2) => (piece, move) => {
  move = action1(piece, move)
  if (move.damages) {
    return action2(piece, move)
  }
  return move
}
