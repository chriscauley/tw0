// TODO AD after deleting old repo move into piece/lib
import { pick } from 'lodash'

import types from './types'
import item from '../item'

const PIECE_DEFAULTS = {
  i_cycle: 0,
  damage: 1,
  health: 1,
  team: 0,
  turns: 1,
  dindex: 1,
  hits: 0,
}

const newPiece = (opts) => {
  const type = types[opts.type]
  if (!type) {
    throw `Unknown type "${opts.type}" for piece`
  }
  const piece = {
    ...PIECE_DEFAULTS,
    ...type.opts,
    ...pick(opts, [
      'type',
      'index',
      'dindex',
      'team',
      'health',
      '_PRNG',
      'i_cycle',
      'max_health',
      'turns',
      '_turn',
      'equipment',
      'lives',
      'player',
    ]),
    name: 'piece',
  }
  if (!piece.max_health) {
    piece.max_health = piece.health
  }
  piece._type = type
  if (piece.player) {
    piece.equipment = opts.equipment || { ...item.default_equipment }
    piece.lives = opts.lives || 2
    piece.turns = 0 // player is stationary while others move
    piece.health = piece.max_health = 3
  }
  return piece
}

const newPlayer = (opts) => {
  const piece = newPiece({
    ...opts,
    team: 1,
  })
  return piece
}

export { newPiece, newPlayer }
