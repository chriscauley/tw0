import { sortBy } from 'lodash'

export default (shape, dist) => (piece, move) => {
  const targets = piece.board.geo
    .look(shape, piece.index, dist, piece.board.dindex)
    .map((index) => piece.board.getOne('piece', index))
    .filter((target) => target && !target.invulnerable && target.team !== piece.team)
  sortBy(targets, 'health')
  const target = targets.find(t => t.player) || targets[0]
  if (target) {
    const dindex = piece.board.geo.floorDindex(target.index - piece.index)
    move.damages = [
      {
        index: target.index,
        count: piece.damage,
        source: piece,
        dindex,
      },
    ]
    move.dindex = dindex
    move.done = true
    move.end = true
  }
  return move
}
