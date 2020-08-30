import { canMoveOn } from '../piece/lib'

const forward = (dist) => (piece, move) => {
  const dindex = move.dindex || piece.dindex
  const targets = piece.board.geo.look('f', piece.index, dist, dindex)
  let valid_index
  for (let i = 0; i < targets.length; i++) {
    const target = targets[i]
    if (canMoveOn(piece.board, target, dindex)) {
      valid_index = target
    } else {
      break
    }
  }
  if (valid_index !== undefined) {
    move.index = valid_index
    move.done = true
  }
  return move
}

forward.bounce = (dist) => {
  const _forward = forward(dist)
  return (piece, move) => {
    move.dindex = -piece.dindex
    return _forward(piece, move)
  }
}

export default forward
