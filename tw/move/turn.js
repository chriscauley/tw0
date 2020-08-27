import { sortBy } from 'lodash'

import { floodFill } from '../utils'

const fromHit = (piece, move) => {
  move.dindex = - piece._last_damage.dindex
  return move
}

const findLowest = (piece, layer) => {
  const forward_index = piece.dindex + piece.index
  let forward_value
  const targets = piece.board.geo.dindexes.map(dindex => {
    const index = piece.index + dindex
    if (index === forward_index) {
      forward_value = layer.value
    }
    return {
      value: layer[index],
      index,
      dindex,
    }
  }).filter(t => t.value !== undefined)
  const target = sortBy(targets, 'value')[0]
  if (target) {
    return target.value === forward_value ? piece.dindex : target.dindex
  }
}

const towardPathOrFoe = (piece, move={}) => {
  const _team = piece.team === 1 ? 2 : 1
  const cache = piece.board.cache
  const dindex = findLowest(piece, cache.team[_team].fill) || findLowest(piece, cache.path.fill)
  if (dindex) {
    move.dindex = dindex
  }
  return move
}

export default {
  fromHit,
  towardPathOrFoe,
}