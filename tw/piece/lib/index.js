export { default as applyDamage } from './applyDamage'
export { default as applyMove } from './applyMove'

export const canAttack = (piece, index) => {
  const target = piece.board.getOne('piece', index)
  if (!target || target.invulnerable) {
    return false
  }
  return target.team !== piece.team || piece.friendly_fire
}

export const canMoveOn = (piece, index, _dindex) => {
  const { getOne } = piece.board
  return getOne('square', index) && !getOne('piece', index) && !getOne('wall', index)
}

export const friendFoeOrEmpty = (piece, index, _dindex) => {
  const { getOne } = piece.board
  if (getOne('piece', index)) {
    return true
  }
  return getOne('square', index) && !getOne('wall', index)
}
