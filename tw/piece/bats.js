import move from '../move'

export default {
  bat: {
    sprites: ['bat.awake'],
    tasks: [
      move.wakeUp,
      move.wait(1),
      move.attackNearby('circle', 1),
      move.turn.towardSound,
      move.forward(1),
    ],
  },
  bigbat: {
    sprite: 'bat-big',
    sprites: ['bat-big.awake'],
    tasks: [
      move.wakeUp,
      move.attackNearby('circle', 1),
      move.turn.towardSound,
      move.forward(1),
    ],
  },
  vampire: {
    sprite: 'vampire',
    sprites: ['vampire.awake'],
    tasks: []
  }
}
