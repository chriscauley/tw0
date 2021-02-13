import Buff from 'tw/models/Buff'

export default (piece, move) => {
  move.now = () => {
    Buff.add(piece, { type: 'invincible', charges: 1 })
    piece.blood_armor = 5
  }
  move.done = true
  return move
}