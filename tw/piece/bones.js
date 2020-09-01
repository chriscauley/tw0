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
  legs4days: {
    geometry: 'f',
    tasks: [
      move.ifDidDamage(move.attackNearby('f', 2), move.forward(1)),
      move.forward(3),
      move.forward.bounce(3),
    ],
  },
  sixlegs: {
    geometry: 'f',
    tasks: [
      move.ifDidDamage(move.attackNearby('f', 3), move.forward(3)),
      move.forward(3),
      move.forward.bounce(3),
    ],
  },
  skeleton: {
    opts: { health: 2 },
    tasks: [
      move
        .energy('health')
        .equals(1)
        .then(move.chain([move.turn.fromHit, move.morph('legday')])),
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
