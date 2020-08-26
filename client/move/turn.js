const fromHit = (piece, move) => {
  move.dindex = - piece._last_damage.dindex
  return move
}

export default {
  fromHit
}