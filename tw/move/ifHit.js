const last_hit = {}

export default (action) => (piece, move) => {
  const damage = piece._last_damage
  if (damage && last_hit[piece.id] !== damage.turn) {
    last_hit[piece.id] = damage.turn
    return action(piece, move)
  }
  return move
}
