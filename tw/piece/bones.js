import move from '../move'

export default {
  legday: {
    geometry: 'f',
    tasks: [
      move.combineWith('skeleton', 'bonetar'),
      move.attackNearby('f', 1),
      move.forward(1),
      move.forward.bounce(1),
    ],
  },
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
      move.attackNearby('circle', 1),
      move.turn.towardPathOrFoe,
      move.forward(1),
    ],
  },
  skull: {
    tasks: [move.attackNearby('circle', 1), move.turn.towardPathOrFoe, move.forward(1)],
  },
  bonetar: {
    opts: { health: 2 },
    tasks: [
      move.wait(1),
      move.ifDidDamage(move.attackNearby('cross', 2), move.forward(1)),
      move.turn.towardPathOrFoe,
      move.forward(2),
    ],
  },
}
