import move from '../move'

export default {
  bat: {
    sprites: ['bat-asleep'],
    tasks: [
      move.wakeUp,
      move.wait(1),
      move.attackNearby('circle', 1),
      move.turn.towardSound,
      move.forward(1),
    ],
  },
  bigbat: {
    sprite: 'bat-boss',
    sprites: ['bat-boss-asleep'],
    tasks: [
      move.wakeUp,
      move.attackNearby('circle', 1),
      move.turn.towardSound,
      move.forward(1),
    ],
  },
}
