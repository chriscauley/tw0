import { sortBy } from 'lodash'

export default (board, piece, move) => {
  const targets = board.geo
        .look(piece.geometry, piece.index, piece.range, piece.dindex)
        .map(index => board.getOne('piece', index))
        .filter(target => target && !target.invulnerable && target.team !== piece.team)
  sortBy(targets, 'health')
  const target = targets[0]
  return target && {
    move,
    damages: [{ index: target.index, count: piece.damage, source: piece.index }],
    done: true,
    end: true,
  }
}