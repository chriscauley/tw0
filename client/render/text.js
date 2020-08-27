

const LEGEND = {
  skeleton: 's',
  skull: 'k',
}


export default (board, options={}) => {
  const { geo, entities } = board
  const {
    xy=[0,0],
    W=geo.W,
    H=geo.H,
  } = options
  const indexes = geo.slice(xy, W, H)
  const out = {}
  indexes.forEach((index) => {
    const wall = entities.wall[index]
    const path = entities.path[index]
    const piece = entities.piece[index]
    if (piece) {
      const { type, team } = piece
      const s = LEGEND[type] || '?'
      out[index] = team === 2 ? s.toUpperCase() : s
    } else if (wall) {
      out[index] = 'X'
    } else if (path) {
      out[index] = path === 1 ? '-' : '|'
    } else {
      out[index] = '.'
    }
  })
  return geo.print(out)
}