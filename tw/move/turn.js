import { sortBy } from 'lodash'

const fromHit = (piece, move) => {
  move.dindex = -piece._last_damage.dindex
  return move
}

const findLowest = (piece, layer) => {
  // TODO pass in move, return modified move
  // TODO should set move.priority and move.dindex
  // TODO if move.priority is set, return unmodified move
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
    .filter((t) => t.value !== undefined)
  const target = sortBy(targets, 'value')[0]
  if (target) {
    return target.value === forward_value ? piece.dindex : target.dindex
  }
}

const towardPathOrFoe = (piece, move = {}) => {
  const _team = piece.team === 1 ? 2 : 1
  const cache = piece.board.cache
  const dindex = findLowest(piece, cache.team[_team].fill) || findLowest(piece, cache.path.fill)
  if (dindex) {
    move.dindex = dindex
  }
  return move
}

const flip = (piece, move) => ({ ...move, dindex: -piece.dindex })

const towardSound = (piece, move = {}) => {
  // TODO use board.cache.sound to find nearest sound. Sounds last 2 turns?
  move.dindex = findLowest(piece, piece.board.cache.sound)
  return move
}

// TODO orRandom needs to use seeded randomness
// probably use a combination of current turn and spawn turn and id or something
const orRandom = (piece, move = {}) => {
  move.dindex = move.dindex || piece.board.geo.dindexes[Math.floor(Math.random() * 4)]
  return move
}

export default {
  fromHit,
  towardPathOrFoe,
  flip,
}
