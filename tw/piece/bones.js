import move from '../move'

export default {
  legday: {
    geometry: 'f',
    tasks: [
      move.morph.combineWith('skeleton', 'bonetaur'),
      move.forward(1),
      move.forward.bounce(1),
    ],
  },
  legs4days: {
    geometry: 'f',
    tasks: [
      move.morph.combineWith('skeleton', 'bonetaur'),
      move.forward(2),
      move.forward.bounce(2),
    ],
  },
  sixlegs: {
    geometry: 'f',
    tasks: [
      move.morph.combineWith('skeleton', 'bonetaur'),
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
      move.turn.follow,
      move.forward(1),
    ],
  },
  skull: {
    tasks: [move.attackNearby('circle', 1), move.turn.follow, move.forward(1)],
  },
  bonetaur: {
    opts: { health: 2 },
    tasks: [
      move.wait(1),
      move.ifDidDamage(move.attackNearby('cross', 2), move.forward(1)),
      move.turn.follow,
      move.forward(2),
    ],
  },
  bonedragon: {
    opts: { health: 4 },
    onHit: [move.turtleUp],
    tasks: [move.wait(1), move.attackNearby('circle', 1), move.turn.follow, move.forward(1)],
  },
}
