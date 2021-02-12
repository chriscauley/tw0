import vector from 'tw/Geo/vector'
import { canMoveOn, canAttack } from '../piece/lib'
import random from 'tw/random'

const forward = (dist, _passive) => (piece, move) => {
  const dindex = move.dindex || piece.dindex
  const target_indexes = piece.board.geo.look('f', piece.index, dist, dindex)
  let valid_index
  for (let i = 0; i < target_indexes.length; i++) {
    const target_index = target_indexes[i]
    if (canMoveOn(piece.board, target_index)) {
      valid_index = target_index
    } else {
      if (!_passive && canAttack(piece, target_index)) {
        move.damages = [
          {
            index: move._can_attack,
            count: piece.damage,
            source: piece,
            dindex: move.dindex,
          },
        ]
        move.done = true
      }
      break
    }
  }
  if (valid_index !== undefined) {
    move.index = valid_index
    move.done = true
  }
  return move
}

// blue blob
forward.bounce = (dist) => {
  const _forward = forward(dist)
  return (piece, move) => {
    move.dindex = -piece.dindex
    return _forward(piece, move)
  }
}

// currently unused. This allows pieces that can move forward but not attack
forward.passive = (dist) => forward(dist, true)

// fly
forward.turnOrFlip = (piece, move) => {
  const geo = piece.board.geo
  const dindex = move.dindex || piece.dindex

  // TODO shuffle somehow
  const target_dindexes = [
    geo.turnDindex(dindex, 1),
    geo.turnDindex(dindex, -1),
    -dindex
  ]

  const moves = target_dindexes
        .map((dindex) => forward(1)(piece, {...move, dindex}))
        .filter((move) => move.done)
  return random.choice(piece.id + piece.index + piece.board.game.turn, moves) || move
}

export default forward
