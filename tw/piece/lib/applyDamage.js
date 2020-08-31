export default (board, damage) => {
  const { count, index, dindex, _sprite, source } = damage
  const piece = board.getPiece(index)
  if (!piece) {
    // piece died since start of turn
    return false
  }
  piece.health -= count
  source &&
    board.animate({
      dindex,
      index: source.index,
      target_index: index,
      type: 'attack',
      source,
    })
  if (piece.health <= 0) {
    board.animate({ type: 'death', index, piece })
    damage.kill = piece
    piece.dead = true
    piece.board.removePiece(piece)
  }
  return true
}
