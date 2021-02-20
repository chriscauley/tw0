import vector from 'tw/Geo/vector'

export default (distance) => (piece, move) => {
  let range = distance
  const dindex = move.dindex || piece.dindex

  while (range) {
    const target_indexes = piece.board.geo.look('__three', piece.index, range, dindex)
    const target_index = target_indexes.find(i => piece.board.canMoveOn(i))
    if (target_index === undefined) {
      range --
      continue
    }
    return {
      ...move,
      index: target_index,
      dindex,
      done: true,
      end: true, // takes all turns
    }
  }
  return move
}
