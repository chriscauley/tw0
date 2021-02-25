import assert from 'assert'

import balls from './balls'
import bats from './bats'
import blind from './blind'
import bones from './bones'
import boos from './boos'
import pots from './pots'

const types = {
  slugs: [],
  groups: {},
}

const title = s => (s[0].toUpperCase() + s.slice(1)).replace(/-_/g,' ')

const registerGroups = (groups) => {
  Object.entries(groups).forEach(([group_name, pieces]) => {
    const group = types.groups[group_name] = {name: group_name, pieces}
    Object.entries(pieces).forEach(([piece_slug, piece]) => {
      piece.tasks?.forEach((t) => {
        assert(typeof t === 'function', `piece ${piece_slug} has bad task`)
      })
      types.slugs.push(piece_slug)
      piece.slug = piece_slug
      piece.name = piece.name || title(piece_slug)
      piece.sprite = piece.sprite || piece_slug
      types[piece_slug] = piece
    })
    Object.assign(types, group)
  })
}

registerGroups({
  balls,
  bats,
  blind,
  bones,
  boos,
  pots,
  player: { warrior: {} },
})

export default types
