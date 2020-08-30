import { sortBy } from 'lodash'

export default (shape, dist) => (piece, move) => {
  const targets = piece.board.geo
    .look(shape, piece.index, dist, piece.board.dindex)
    .map((index) => piece.board.getOne('piece', index))
    .filter((target) => target && !target.invulnerable && target.team !== piece.team)
  sortBy(targets, 'health')
  const target = targets[0]
  if (target) {
    move.damages = [{ index: target.index, count: piece.damage, source: piece.index }]
    move.done = true
    move.end = true
  }
  return move
}
