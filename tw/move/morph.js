import after from './after'

const doMorph = (type, piece) => {
  const { board, index, dindex, team } = piece
  piece.dead = true
  board.removePiece(piece)
  board.newPiece({ index, type, dindex, team })
}

export default type => (piece, move) => {
  return after({ ...move, done: true }, () => doMorph(type, piece))
}

// export const combineWith = (target_type, new_type, opts = {}) => {
//   const { geometry = geo.look.f, range = 1 } = opts
//   return (piece, move) => {
//     const target_indexs = geo.look.lookMany(piece.index, geometry[piece.dindex][range])
//     const target = piece.board
//       .getMany('piece', target_indexs)
//       .find(target => target.type === target_type)
//     if (target) {
//       return {
//         ...doMorph(new_type, target),
//         now: () => {
//           target.dead = true
//           piece.board.removePiece(piece)
//           piece.dead = true
//         },
//       }
//     }
//     return move
//   }
// }
