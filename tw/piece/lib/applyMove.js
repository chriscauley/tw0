export default (piece, move) => {
  const { index, dindex = piece.dindex, after = [] } = move
  move._from = piece.index
  if (index !== undefined && index !== piece.index) {
    piece.board.setPiece(index, piece)
  }
  if (dindex !== undefined) {
    piece.dindex = dindex
  }

  // TODO old tw code
  after.forEach((f) => piece.board.game.afterturn.push(() => f(piece, move)))
  piece._last_move = move
  if (move.now) {
    move.now(piece)
  }
  // if (move.push) {
  //   const target = piece.board.getOne('piece', move.push.xy)
  //   if (target && target._type && target._type.onPush) {
  //     target._type.onPush(target, move.push.dxy)
  //   }
  // }
  if (!piece.player && !move.passive) {
    // passive moves (piece.onHit) do not cost turns
    // and player is not managed using these variables
    piece._turn = piece.board.game.turn // indicates this moved this turn
    piece.board.game.piece_turns[piece.id]--
    piece.board.game._moved++
  }
  if (move.end) {
    piece.board.game.piece_turns[piece.id] = 0
  }
}
