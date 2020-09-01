import { sortBy, range } from 'lodash'

const addHealth = (piece, out) => {
  const HEART = 'fa fa-heart text-red-400'
  if (piece.max_health > 1) {
    if (piece.health > 2) {
      out.children.push(HEART)
      out.children.push('fa fa-question text-white')
    } else {
      range(piece.health).forEach(() => out.children.push('fa fa-heart text-red-400'))
    }
  }
}

export default (board, options = {}) => {
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
    }),
    sound: (i, v) => ({
      id: `sound-${i}`,
      className: `sound sprite sound-${v} ${css.index(i)}`,
    }),
    sound_cache: (i, v) => ({
      id: `sound_cache-${i}`,
      className: `sound_cache sprite sound-${v} ${css.index(i)}`,
    }),
    square: (i) => {
      const xy = geo.index2xy(i)
      const n = ((xy[0] % 2) + (xy[1] % 2)) % 2
      return {
        className: `sprite square sprite-floor${n} ${css.index(i)}`,
        id: `square-${i}`,
      }
    },
    piece: (p) => ({
      // no index because this will be set several times
      className: `sprite sprite-${p.type} piece`,
      id: `piece-${p.id}`,
      children: [],
      steps: [],
    }),
  }

  const spritePiece = (piece) => {
    const out = css.piece(piece)
    out._base = out.className
    out.className += css.index(piece._indexes[0])
    piece._indexes.forEach((i, n) => {
      let cls = out._base + css.index(i)
      const attack = animations[i].filter((a) => a.type === 'attack')[0]
      if (attack) {
        cls += ' attack-' + geo._dindex2name[attack.dindex]
      }
      if (attack || n > 0) {
        out.steps.push(cls)
      }
    })
    const last = out.steps[out.steps.length - 1]
    if (last && last.includes(' attack-')) {
      out.steps.push(last.replace(/ attack-./, ''))
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
  sortBy(items, 'id') // stops react from re-ording the pieces

  indexes.forEach((index) => {
    const wall = board.getOne('wall', index)
    if (wall) {
      items.push(css.wall(index, wall))
    } else if (board.getOne('square', index)) {
      items.push(css.square(index))
    }
    const sound = board.getOne('sound', index)
    if (sound !== undefined) {
      items.push(css.sound(index, sound))
    }
    const sound_cache = board.cache.sound[index]
    if (sound_cache !== undefined) {
      items.push(css.sound_cache(index, sound_cache))
    }
  })
  return {
    boardClass: `board W-${W} H-${H}`,
    items,
  }
}
