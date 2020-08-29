import { canMoveOn } from '../piece/lib'

const forward = (piece, move) => {
  const dindex = move.dindex || piece.dindex
  const target = piece.index + dindex
  if (canMoveOn(piece, target, dindex)) {
    move.index = target
    move.done = true
  }
  return move
}

forward.bounce = (piece, move) => {
  move.dindex = -piece.dindex
  return forward(piece, move)
}

export default forward
