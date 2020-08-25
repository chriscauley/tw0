import move from '../move'

export default {
  skeleton: {
    range: 1,
    geometry: 'f',
    opts: { health: 2 },
    tasks: [
      // move.energy('health').equals(1).then(
      //   move.chain([
      //     move.turn.fromHit,
      //     move.morph('runner')
      //   ])
      // ),
      move.wait(1),
      // move.attack,
      // move.findNearby,
      move.forward
    ]
  },
}