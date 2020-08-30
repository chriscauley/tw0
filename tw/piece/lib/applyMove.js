export default (piece, move, turn) => {
  if (piece.preMove) {
    piece.preMove()
  }
  const { index, dindex = piece.dindex, after = [] /*preMove*/ } = move
  move._from = piece.index
  if (index !== undefined && index !== piece.index) {
    piece.board.setPiece(index, piece)
  }
  if (dindex !== undefined) {
    piece.dindex = dindex
  }

  piece._turn = turn // indicates this moved this turn
  // TODO old tw code
  after.forEach((f) => piece.board.game.afterturn.push(() => f(piece, move)))
  // piece.last_move = move
  // piece.preMove = preMove
  if (move.now) {
    move.now(piece)
  }
  // if (move.push) {
  //   const target = piece.board.getOne('piece', move.push.xy)
  //   if (target && target._type && target._type.onPush) {
  //     target._type.onPush(target, move.push.dxy)
  //   }
  // }
  piece.board.game.piece_turns[piece.id] --
  if (move.end) {
    piece.board.game.piece_turns[piece.id] = 0
  }
}
