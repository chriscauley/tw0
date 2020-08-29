import move from '../move'

export default {
  skeleton: {
    opts: { health: 2 },
    tasks: [
      // move.energy('health').equals(1).then(
      //   move.chain([
      //     move.turn.fromHit,
      //     move.morph('runner')
      //   ])
      // ),
      move.wait(1),
      move.attackNearby,
      move.turn.towardPathOrFoe,
      move.forward,
    ],
  },
  skull: {
    tasks: [move.attackNearby, move.turn.towardPathOrFoe, move.forward],
  },
}
