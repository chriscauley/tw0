import assert from 'assert'

const alpha = 'abcdefghijklmnopqrstuvwxyz'
const ALPHA = alpha.toUpperCase()
const numbers = '0123456789'

export const alphabet = alpha.split('')
export const alphanum = (alpha + ALPHA + numbers).split('')
export const numalpha = (numbers + alpha + ALPHA).split('')
const toNumAlpha = (v) => (v === undefined ? v : numalpha[v] || '?')
const LEGEND = {
  legday: 'l',
  skeleton: 's',
  skull: 'k',
  bonetaur: 'b',
}

const ANIMATION_LEGEND = {
  collide: '#',
  death: '%',
}

export default (board, options = {}) => {
  const { geo } = board
  const {
    xy = [0, 0],
    W = geo.W,
    H = geo.H,
    _extra_layers = [], // see warning
    layer = 'piece_type',
    empty,
    path = true,
    highlight = [],
  } = options
  const indexes = geo.slice(xy, W, H)
  const main = renderLayer(board, { layer, indexes, path })
  highlight.forEach((index, i) => {
    main[index] = toNumAlpha(i)
  })
  const title = layer
    .replace(/^piece_/, '')
    .slice(0, board.geo.W)
    .padEnd(board.geo.W)
  const extras = []
  indexes.forEach((index) => {
    const [_x, y] = geo.index2xy(index)
    const values = []
    extras[y] = extras[y] || ''
    // extra_layers.forEach((layer) => {
    //   const value = LAYERS[layer](board, index)
    //   if (value !== undefined) {
    //     values.push(value)
    //   }
    // })
    if (values.length) {
      extras[y] += `${index}:${values.join(',')}\t`
    }
    if (board.animations[index]) {
      board.animations[index].forEach((animation) => {
        let value = ANIMATION_LEGEND[animation.type] + board.geo.index2xy(index)[0]
        if (animation.piece) {
          value += LEGEND[animation.piece.type] || '?'
        }
        extras[y] += value + '\t'
      })
    }
  })
  return geo.print(main, { title, extras, empty })
}

const getPieceId = (b, i) => b.entities.piece[i] && b.entities.piece[i].id
const getPieceIndex = (b, i) => b.entities.piece[i] && b.entities.piece[i].index
const getPieceDindex = (board, index) => {
  const piece = board.entities.piece[index]
  if (piece) {
    return board.geo._dindex2name[piece.dindex] || 'o'
  }
}

const getPieceType = (board, index) => {
  const piece = board.entities.piece[index]
  if (piece) {
    const { type, team } = piece
    const s = LEGEND[type] || '?'
    return team === 2 ? s.toUpperCase() : s
  }
}

const renderLayer = (board, { layer, indexes, path }) => {
  const getter = LAYERS[layer]
  assert(getter, 'You must specify a layer')
  const out = {}
  indexes.forEach((index) => {
    const _path = board.entities.path[index]
    const wall = board.entities.wall[index]
    const value = getter(board, index)
    if (value) {
      out[index] = value
    } else if (wall) {
      out[index] = wall
    } else if (path && _path) {
      out[index] = Math.abs(_path) === 1 ? '-' : '|'
    }
  })
  return out
}

const LAYERS = {
  piece_index: getPieceIndex,
  piece_id: getPieceId,
  piece_dindex: getPieceDindex,
  piece_type: getPieceType,
  'cache.dpath': (b, i) => b.geo._dindex2char[b.cache.path.dfill[i]],
  'cache.path': (b, i) => toNumAlpha(b.cache.path.fill[i]),
}
