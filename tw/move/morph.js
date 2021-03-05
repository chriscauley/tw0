import after from './after'

const doMorph = (type, piece) => {
  const { board, index, dindex, team } = piece
  piece.dead = true
  board.removePiece(piece)
  board.newPiece({ index, type, dindex, team })
}

const morph = (type) => (piece, move) => {
  return after({ ...move, done: true }, () => doMorph(type, piece))
}

morph.combineWith = (target_type, new_type, opts = {}) => {
  const { shape = 'f', dist = 1 } = opts
  return (piece, move) => {
    const target_indexes = piece.board.geo.look(shape, piece.index, dist, piece.dindex)
    const target = piece.board
      .getMany('piece', target_indexes)
      .find((target) => target.type === target_type && target.team === piece.team)
    if (target) {
      move = {
        ...move,
        now: () => {
          target.dead = true
          piece.board.removePiece(piece)
          piece.dead = true
        },
      }
      return after(move, () => doMorph(new_type, target))
    }
    return move
  }
}

export default morph
