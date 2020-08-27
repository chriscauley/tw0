const LEGEND = {
  skeleton: 's',
  skull: 'k',
}

const _join = (strings) => {
  // combine several multi-line strings into one multiline string (horizontal concatenation)
  const result = []
  const splitted_strings = strings.map(s => s.split('\n'))
  splitted_strings[0].forEach((_, i) => {
    result.push(splitted_strings.map(lines => lines[i]).join('\t'))
  })
  return result.join('\n')
}

export default (board, layers, options={}) => {
  const { geo, entities } = board
  const {
    xy=[0,0],
    W=geo.W,
    H=geo.H,
  } = options
  const indexes = geo.slice(xy, W, H)
  return _join(layers.map(layer => renderLayer(board, layer, indexes)))
}

const getPieceId = (b, i) => b.entities.piece[i] && b.entities.piece[i].id
const getPieceIndex = (b, i) => b.entities.piece[i] && b.entities.piece[i].index
const getPieceDindex = (board, index) => {
  const piece = board.entities.piece[index]
  if (piece) {
    return board.geo._dindex2char[piece.dindex] || 'o'
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

const renderLayer = (board, layer, indexes) => {
  const getter = LAYERS[layer]
  const out = {}
  indexes.forEach((index) => {
    const wall = board.entities.wall[index]
    const path = board.entities.path[index]
    const value = getter(board, index)
    if (value) {
      out[index] = value
    } else if (wall) {
      out[index] = 'X'
    } else if (path) {
      out[index] = Math.abs(path) === 1 ? '-' : '|'
    } else {
      out[index] = '.'
    }
  })
  const title = layer.replace(/^piece_/,'').slice(0, board.geo.W).padEnd(board.geo.W)
  return board.geo.print(out, {title})
}

const LAYERS = {
  piece_index: getPieceIndex,
  piece_id: getPieceId,
  piece_dindex: getPieceDindex,
  piece_type: getPieceType,
}