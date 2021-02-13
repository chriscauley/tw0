import { range } from 'lodash'
import types from 'tw/piece/types'

const piece_map = {}
types.slugs.forEach(s => piece_map[s] = types[s].sprite)

const addHealth = (piece, out) => {
  const blood = piece.blood_armor
  const HEART = `sprite sprite-heart ${blood ? 'micro' : 'mini'}-sprite`
  const BLOOD_ARMOR = 'sprite sprite-blood_armor mini-sprite'
  const INVINCIBLE = 'sprite sprite-invincible'
  if (piece.invincible) {
    out.children.push(INVINCIBLE)
  }
  if (piece.health > 100) {
    // show nothing
  } else if (piece.health > 4) {
    out.children.push(HEART)
    out.children.push('fa fa-question text-white mini-sprite')
  } else if (piece.max_health > 1) {
    range(piece.health).forEach(() => out.children.push(HEART))
  }
  if (blood) {
    range(blood).forEach(() => out.children.push(BLOOD_ARMOR))
  }
}

export const extra_getters = {
  off: () => ({}),
  sound: (b) => b.entities.sound,
  sound_cache: (b) => b.cache.sound,
  path: (b) => b.entities.path,
}

const team_extras = ['id', 'value', 'index', 'dindex']
;[1, 2].forEach((team) =>
  team_extras.forEach(
    (attr) =>
      (extra_getters[`team${team}_${attr}`] = (b) =>
        Object.fromEntries(
          Object.entries(b.cache.team[team]).map(([index, cache]) => [index, cache[attr]]),
        )),
  ),
)

export default (board, options = {}) => {
  const extra_layer = (extra_getters[options.extra] || extra_getters.off)(board)
  const { geo } = board
  const { xy0 = [0, 0], W = geo.W, H = geo.H, _empty, _highlight = [] } = options
  const items = []
  const indexes = geo.slice(xy0, W, H)
  const pieces = {}
  const index2xy = (i) => {
    const xy = geo.index2xy(i)
    return [xy[0] - xy0[0], xy[1] - xy0[1]]
  }

  const css = {
    index: (i) => {
      const xy = index2xy(i)
      return ` x-${xy[0]} y-${xy[1]}`
    },
    wall: (i, v) => ({
      className: `sprite ${css.index(i)} wall-${v} sprite-wall${((i + 151) % 127) % 5}`,
      id: `wall-${i}`,
      index: i,
    }),
    sound: (i, v) => ({
      id: `sound-${i}`,
      className: `sound sprite ${css.index(i)}`,
      text: v,
      index: i,
    }),
    square: (i) => {
      const xy = geo.index2xy(i)
      const n = ((xy[0] % 2) + (xy[1] % 2)) % 2
      return {
        className: `sprite square sprite-floor${n} ${css.index(i)}`,
        id: `square-${i}`,
        index: i,
      }
    },
    piece: (p) => ({
      // no index because this will be set several times
      className: `sprite piece ${p.wait !== undefined ? 'wait-' + p.wait : ''} team-${p.team}`,
      id: `piece-${p.id}`,
      children: [`sprite sprite-${piece_map[p.type]} ${p.awake ? 'awake' : ''}`],
      steps: [],
      index: p.index,
    }),
    node: (i, v) => ({
      className: `sprite sprite-node-${v} node ${css.index(i)}`,
      id: `node-${i}`,
      index: i,
    }),
  }

  const spritePiece = (piece) => {
    const out = css.piece(piece)
    out._base = out.className
    out.className += css.index(piece._indexes[0])
    const di_name = geo._dindex2name[piece.dindex]
    piece._indexes.forEach((i, n) => {
      let cls = out._base + css.index(i)
      const attack = animations[i].filter((a) => a.type === 'attack')[0]
      if (attack) {
        cls += ' attack-' + di_name
      }
      if (attack || n > 0) {
        out.steps.push(cls)
      }
    })
    const last = out.steps[out.steps.length - 1]
    if (last && last.includes(' attack-')) {
      out.steps.push(last.replace(/ attack-./, ''))
    }
    if (out.steps.length) {
      out.steps[out.steps.length - 1] += ` dindex-${di_name}`
    } else {
      out.className += ` dindex-${di_name}`
    }
    out.piece = piece
    pieces[piece.id] = piece
    items.push(out)
    addHealth(piece, out)
    return out
  }

  const animations = {}
  indexes.forEach((index) => {
    animations[index] = board.animations[index] || []
  })

  board.getPieces().forEach(spritePiece)
  indexes.forEach((index) => {
    // dead pieces aren't in board.getPieces()
    animations[index].forEach((a) => {
      if (a.type === 'death') {
        const item = spritePiece(a.piece)
        const last = item.steps[item.steps.length - 1]
        item.steps.push(last + ' is_dead')
      }
    })
  })

  indexes.forEach((index) => {
    const wall = board.getOne('wall', index)
    if (wall) {
      items.push(css.wall(index, wall))
    } else if (board.getOne('square', index)) {
      items.push(css.square(index))
      const extra_value = extra_layer[index]
      if (extra_value !== undefined) {
        items.push(css.sound(index, extra_value))
      }
    }
  })

  board.options.nodes.forEach((index) => {
    items.push(css.node(index, board.entities.node[index]))
  })

  return {
    boardClass: `board W-${W} H-${H}`,
    items,
  }
}
