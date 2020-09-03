import { canMoveOn, canAttack } from '../piece/lib'

const forward = (dist) => (piece, move) => {
  const dindex = move.dindex || piece.dindex
  const target_indexes = piece.board.geo.look('f', piece.index, dist, dindex)
  let valid_index
  for (let i = 0; i < target_indexes.length; i++) {
    const target_index = target_indexes[i]
    if (canMoveOn(piece.board, target_index)) {
      valid_index = target_index
    } else {
      if (canAttack(piece, target_index)) {
        move._can_attack = target_index
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

forward.bounce = (dist) => {
  const _forward = forward(dist)
  return (piece, move) => {
    move.dindex = -piece.dindex
    return _forward(piece, move)
  }
}

forward.attack = (dist) => {
  const f = forward(dist)
  return (piece, move) => {
    // like move forward, but does domage if runs into enemy
    move = f(dist)(move)
    if (move._can_attack) {
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
    return move
  }
}

export default forward
