export default (board, damage) => {
  const { count, index /*, dindex, sprite, source*/ } = damage
  const piece = board.getPiece(index)
  if (!piece) {
    // piece died since start of turn
    return false
  }
  piece.health -= count
  // piece.board.renderer.animations.push({
  //   index,
  //   dindex,
  //   sprite,
  //   className: 'fade',
  //   damage_source: source && source.type,
  // })
  if (piece.health <= 0) {
    board.animate({ type: 'death', index, piece })
    damage.kill = piece
    // #! TODO should also do death animation
    piece.dead = true
    piece.board.removePiece(piece)
  }
  return true // TODO return animation here?
}
