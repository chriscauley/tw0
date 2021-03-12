import after from './after'
import { sortBy, min } from 'lodash'

const filterLowest = (piece, move, cache) => {
  const targets = piece.board.geo.dindexes
    .map((dindex) => {
      const index = piece.index + dindex
      return {
        ...cache[index],
        source_dindex: dindex, // direction piece would move to get here
        is_forward: dindex === piece.dindex, // is that direction forward?
      }
    })
    .filter((t) => t.value !== undefined)
    .filter((t) => piece.board.canMoveOn(t.index))
  const lowest = min(targets.map((t) => t.value))
  return targets.filter((t) => t.value === lowest)
}

const follow = (piece, move) => {
  if (move.dindex) {
    // already turned this move, continue
    return move
  }
  // TODO "follow" may be adding complexity here and not actually changing anything
  // Turn piece towards nearest enemy, favoring piece.following (last turns target)
  // Also favor shrinking larger dx, dy or moving foward
  let targets = filterLowest(piece, move, piece.board.cache.team[piece.team])

  if (piece.following !== undefined) {
    if (!targets.find((t) => t.id === piece.following)) {
      // can no longer see following piece (enemy moved in way or piece died)
      delete piece.following
    } else {
      // if two pieces have equal value, this favors the piece.following
      targets = targets.filter((t) => t.id === piece.following)
    }
  }

  // "close the gap" - if [9, 1] away from a target, move towards them in x
  const min_dx_or_dy = min(
    targets.map((t) => {
      const xy = piece.board.geo.index2xy(t.index - t.target_index)
      t._dx_or_dy = Math.max(Math.abs(xy[0]), Math.abs(xy[1]))
      return t._dx_or_dy
    }),
  )
  targets = targets.filter((t) => t._dx_or_dy === min_dx_or_dy)

  // finally, favor moving forward over turning
  const target = targets.find((t) => t.is_forward) || targets[0]

  if (target) {
    after(move, () => (piece.following = target.id))
    move.dindex = target.source_dindex
    move.priority = target.value
  }

  return move
}

const fromHit = (piece, move) => Object.assign(move, { dindex: piece._last_damage.dindex })

// TODO either merge with filterLowest or move into towardSound (since this is only used there)
const findLowest = (piece, layer, move = {}) => {
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

const flip = (piece, move) => ({ ...move, dindex: -piece.dindex })

const towardSound = (piece, move = {}) => {
  move = findLowest(piece, piece.board.cache.sound, move)
  return move
}

export default {
  fromHit,
  follow,
  towardSound,
  flip,
}
