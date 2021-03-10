import Buff from 'tw/models/Buff'

const add = (type, charges) => (piece, move) => {
  move.now = () => Buff.add(piece, { type, charges })
  return move
}

export default { add }