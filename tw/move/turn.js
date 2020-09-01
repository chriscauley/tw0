import { sortBy } from 'lodash'

const fromHit = (piece, move) => {
  move.dindex = -piece._last_damage.dindex
  return move
}

const findLowest = (piece, layer, move) => {
  if (move.priority !== undefined) {
    // previously found a lower priority move
    return move
  }
  const forward_index = piece.dindex + piece.index
  let forward_value
  const targets = piece.board.geo.dindexes
    .map((dindex) => {
      const index = piece.index + dindex
      if (index === forward_index) {
        forward_value = layer.value
      }
      return {
        value: layer[index],
        index,
        dindex,
      }
    })
    .filter((t) => piece.board.canMoveOn(t.index))
    .filter((t) => t.value !== undefined)
  const target = sortBy(targets, 'value')[0]
  if (target) {
    move.priority = target.value
    move.dindex = target.value === forward_value ? piece.dindex : target.dindex
  }
  return move
}

const towardPathOrFoe = (piece, move = {}) => {
  const _team = piece.team === 1 ? 2 : 1
  const cache = piece.board.cache
  move = findLowest(piece, cache.team[_team].fill, move)
  move = findLowest(piece, cache.path.fill, move)
  return move
}

const flip = (piece, move) => ({ ...move, dindex: -piece.dindex })

const towardSound = (piece, move = {}) => {
  move = findLowest(piece, piece.board.cache.sound, move)
  return move
}

export default {
  fromHit,
  towardPathOrFoe,
  towardSound,
  flip,
}
