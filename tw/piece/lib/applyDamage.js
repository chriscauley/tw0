import applyMove from './applyMove'
import getMove from './getMove'

const doDamage = (piece, damage) => {
  damage.type = 'health'
  if (piece.blood_armor > 0) {
    damage.type = 'blood_armor'
    piece.blood_armor --
  } else if (piece.stone_armor > 0) {
    piece.stone_armor --
    damage.type = 'stone_armor'
  } else if (piece.health < damage.count) {
    piece.health = 0
  } else {
    piece.health --
  }
}

export default (board, damage) => {
  const { count, index, dindex, _sprite, source } = damage
  const piece = damage.target = board.getPiece(index)
  if (!piece) {
    // piece died since start of turn
    return false
  }
  if (piece.invincible) {
    // invincible pieces can be attacked but do not take damage
    damage.type = 'invincible'
    return true
  }

  const old_health = piece.health
  doDamage(piece, damage)
  source &&
    board.animate({
      dindex,
      index: source.index,
      target_index: index,
      type: 'attack',
      source,
    })
  if (piece.health <= 0) {
    board.animate({ type: 'death', index, piece })
    damage.kill = piece
    piece.dead = true
    piece.board.removePiece(piece)
  } else if (piece.health !== old_health) {
    damage.turn = piece.board.game.turn
    piece._last_damage = damage
    piece._type.onHit && applyMove(piece, getMove(piece, 'onHit'))
  }
  return true
}
