import move from '../move'

export default {
  bat: {
    tasks: [
      move.wakeUp,
      move.wait(1),
      move.attackNearby('circle', 1),
      move.turn.towardSound,
      move.forward(1),
    ],
  },
  bigbat: {
    tasks: [move.wakeUp, move.attackNearby('circle', 1), move.turn.towardSound, move.forward],
  },
}
