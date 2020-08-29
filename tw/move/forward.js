import { canMoveOn } from '../piece/lib'

export default (piece, move) => {
  const dindex = move.dindex || piece.dindex
  const target = piece.index + dindex
  if (canMoveOn(piece, target, dindex)) {
    move.index = target
  }
  return move
}
