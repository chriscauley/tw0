import move from 'tw/move'

export default {
  ball: {
    opts: { health: 2**20 },
    tasks: [
      move.ifHit(move.turn.fromHit),
      move.forward.collide
    ],
  }
}