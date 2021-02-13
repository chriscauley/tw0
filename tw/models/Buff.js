const buffs = {
  haste: {
    apply: (piece) => (piece.board.game.piece_turns[piece.id]++),
    sprite: 'buff-haste',
  },
  stun: {
    apply: (piece) => (piece.board.game.piece_turns[piece.id] = 0),
    sprite: 'buff-stun',
  },
  invincible: {
    sprite: null,
    remove: (piece) => delete piece.invincible,
    add: (piece) => (piece.invincible = true),
  }
}

const pieceCanBuffTarget = (piece, target) => {
  // this is a placeholder for friendly fire logic (ie bad buffs can target enemies)
  // could also be used to block buff (unstunable pieces, etc)
  return piece.team === target.team
}

const add = (target, { type, charges }) => {
  target.buff = {
    type,
    charges,
  }
  buffs[type].add?.(target)
}

const apply = (piece) => {
  const { buff } = piece
  if (buff.charges > 0) {
    buff.charges -= 1
    buffs[buff.type].apply?.(piece)
  } else {
    buffs[buff.type].remove?.(piece)
    delete piece.buff
  }
}

export default {
  add,
  apply,
  pieceCanBuffTarget,
}
