export default (piece, damage) => {
  const { count, index, dindex, sprite, source } = damage
  piece.health -= count
  // piece.board.renderer.animations.push({
  //   index,
  //   dindex,
  //   sprite,
  //   className: 'fade',
  //   damage_source: source && source.type,
  // })
  if (piece.health <= 0) {
    damage.kill = piece
    // #! TODO should also do death animation
    piece.dead = true
    piece.board._addGold(piece.board.xy2i(xy), 1)
    piece.board.removePiece(piece)
  }
}
