import { sortBy } from 'lodash'

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
    }),
  }

  const spritePiece = (piece) => {
    const out = css.piece(piece)
    out._base = out.className
    out.className += css.index(piece._indexes[0])
    piece._indexes.forEach((i, n) => {
      const s = n === 0 ? 'className' : `step${n}`
      out[s] = out._base + css.index(i)
    })
    out.piece = piece
    pieces[piece.id] = piece
    items.push(out)
    return out
  }

  board.getPieces().forEach(spritePiece)
  indexes.forEach((index) =>
    (board.animations[index] || []).forEach((a) => {
      if (a.type === 'death') {
        const item = spritePiece(a.piece)
        item.className += ' is_dead'
      }
    }),
  )
  sortBy(items, 'id') // stops react from re-ording the pieces

  indexes.forEach((index) => {
    const wall = board.getOne('wall', index)
    if (wall) {
      items.push(css.wall(index, wall))
    } else if (board.getOne('square', index)) {
      items.push(css.square(index))
    }
  })
  return {
    boardClass: `board W-${W} H-${H}`,
    items,
  }
}
