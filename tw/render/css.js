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
  const clss = (item) => {
    const xy = index2xy(item.index)
    let className = `sprite x-${xy[0]} y-${xy[1]}`
    if (item.last_index) {
      const xy0 = index2xy(item.last_index)
      className += ` x0-${xy0[0]} y0-${xy0[1]}`
    }
    if (item.wall) {
      className += ` wall-${item.wall} sprite-wall${((item.index + 151) % 127) % 5}`
    } else if (item.square) {
      const s = ((xy[0] % 2) + (xy[1] % 2)) % 2
      className += ` sprite-floor${s}`
    }
    return {
      className,
      id: item.id,
    }
  }

  const spritePiece = (piece) => {
    const out = clss(piece)
    out.className += ` sprite-${piece.type} piece`
    out.id = `piece-${piece.id}`
    pieces[piece.id] = piece
    items.push(out)
    return out
  }

  board.getPieces().forEach(spritePiece)
  indexes.forEach((index) => {
    board.animations[index] &&
      board.animations[index].forEach((a) => {
        if (a.type === 'death') {
          const item = spritePiece(a.piece)
          item.className += ' is_dead'
        }
      })
  })

  indexes.forEach((index) => {
    const wall = board.getOne('wall', index)
    if (wall) {
      items.push(clss({ index, wall, id: `wall-${index}` }))
    } else if (board.getOne('square', index)) {
      items.push(clss({ index, square: true, id: `square-${index}` }))
    }
  })
  return {
    boardClass: `board W-${W} H-${H}`,
    items,
  }
}
