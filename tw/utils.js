export const assert = (bool, e) => {
  if (!bool) {
    throw typeof e === 'function' ? e() : e
  }
}

export const mod = (n, d) => ((n % d) + d) % d

export const floodFill = ({ board, pieces, criteria, use_piece_dindex, max_level = 16 }) => {
  // creates two maps
  // fill distance to nearest piece (or piece-like object)
  // dfill direction to nearest piece OR direction nearest piece is facing
  // TODO really need two dfills, but not sure what to call them
  // maybe rename these as distance, dindex, and target_dindex?
  const fill = {}
  const dfill = {}
  let next_targets = []
  let found = 0
  let last_found
  let level = 1
  pieces.forEach((p) => {
    fill[p.index] = 0
    dfill[p.index] = p.dindex
    next_targets.push(p)
  })
  while (found !== last_found && level < max_level) {
    last_found = found
    const targets = next_targets
    next_targets = []
    targets.forEach((piece) => {
      const look_dindexes = board.geo.look('circle', 0, 1, piece.dindex)
      look_dindexes.forEach((look_dindex) => {
        const target_index = look_dindex + piece.index
        if (criteria(target_index) && !fill.hasOwnProperty(target_index)) {
          const dindex = use_piece_dindex ? piece.dindex : -look_dindex
          fill[target_index] = level
          dfill[target_index] = dindex
          next_targets.push({ index: target_index, dindex })
          found++
        }
      })
    })
    level++
  }
  return { fill, dfill }
}

export const floodFillPath = (board) => {
  const pieces = Object.entries(board.entities.path).map(([index, dindex]) => ({
    dindex,
    index: parseInt(index),
  }))
  if (pieces.length === 1) {
    const dfill = {}
    const fill = {}
    board.geo.indexes.forEach((i) => (dfill[i] = 1))
    return { dfill, fill }
  }
  return floodFill({
    board,
    pieces,
    criteria: (index) => !board.entities.wall[index] && board.entities.square[index],
    use_piece_dindex: true,
  })
}

export const floodFillTeam = (board, team) => {
  const pieces = board.getPieces().filter((p) => p.team === team)
  const { entities } = board
  return floodFill({
    board,
    pieces,
    criteria: (index) => !entities.wall[index] && entities.square[index] && !entities.piece[index],
  })
}
