import { pick } from 'lodash'

const MAX_LEVEL = 8

export const mod = (n, d) => ((n % d) + d) % d

export const floodFill = ({ board, pieces, criteria, use_piece_dindex }) => {
  // creates two maps
  // fill distance to nearest piece (or piece-like object)
  // dfill direction to nearest piece OR direction nearest piece is facing
  // TODO really need two dfills, but not sure what to call them
  // maybe rename these as distance, dindex, and target_dindex?
  const cache = {}
  let found = 0
  let last_found
  let level = 1
  let next_targets = pieces.map((p) => {
    const next = pick(p, ['index', 'dindex', 'id'])
    next.target_index = p.index
    cache[p.index] = next
    return next
  })
  while (found !== last_found && level < MAX_LEVEL) {
    last_found = found
    const targets = next_targets
    next_targets = []
    targets.forEach((piece) => {
      const look_dindexes = board.geo.look('circle', 0, 1, piece.dindex)
      look_dindexes.forEach((look_dindex) => {
        const index = look_dindex + piece.index
        if (criteria(index) && !cache.hasOwnProperty(index)) {
          const dindex = use_piece_dindex ? piece.dindex : -look_dindex
          cache[index] = {
            index,
            target_index: piece.target_index,
            value: level,
            dindex: dindex,
            id: piece.id,
          }
          next_targets.push(cache[index])
          found++
        }
      })
    })
    level++
  }
  return cache
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
  const pieces = board.getPieces().filter((p) => p.team !== team)
  const { entities } = board
  return floodFill({
    board,
    pieces,
    criteria: (index) => !entities.wall[index] && entities.square[index] && !entities.piece[index],
  })
}
