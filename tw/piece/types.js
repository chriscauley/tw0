import bones from './bones'
import bats from './bats'
import pots from './pots'
import { assert } from '../utils'

const types = {
  slugs: [],
  groups: {},
}

const title = s => (s[0].toUpperCase() + s.slice(1)).replace(/-_/g,' ')

const registerGroups = (groups) => {
  Object.entries(groups).forEach(([name, pieces]) => {
    const group = types.groups[name] = {name, pieces}
    Object.entries(pieces).forEach(([piece_slug, piece]) => {
      piece.slug = piece_slug
      piece.name = piece.name || title(piece_slug)
      types[piece_slug] = piece
    })
  })
}

registerGroups({
  bats,
  bones,
  pots,
  player: { warrior: {} },
})

Object.entries({ bats, bones }).forEach(([lib_name, lib]) => {
  Object.entries(lib).forEach(([piece_name, piece]) => {
    piece.tasks.forEach((t) => {
      assert(typeof t === 'function', () => {
        throw `piece ${piece_name} has bad task`
      })
    })
    types.slugs.push(piece_name)
  })
  Object.assign(types, lib)
  types[lib_name] = lib
})

export default types
