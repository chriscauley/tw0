import Buff from 'tw/models/Buff'

const add = (type, charges) => (piece, move) => {
  console.log('add')
  move.now = () => Buff.add(piece, { type, charges })
  return move
}

export default { add }