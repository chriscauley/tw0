import move from 'tw/move'

export default {
  boo: {
    geometry: 'f',
    opts: { sight: 8 },
    // sprite: 'wisp',
    tasks: [
      move.ifLookedAt(move.booOff),
      // move.turn.follow.hero,
      move.turn.follow,
      move.attackNearby('circle', 1),
      move.forward(1)
    ],
  },
  boo2: {
    geometry: 'f',
    // sprite: 'shade',
    opts: { turns: 2, sight: 8 },
    tasks: [move.ifLookedAt(move.booOff), move.turn.follow.hero, move.turn.follow, move.forward(1)],
  },
  // boohoo: {
  //   geometry: 'f',
  //   sprite: 'wraith',
  //   opts: { turns: 3, health: 3, sight: 5 },
  //   tasks: [
  //     move.ifHit(move.teleport(4)),
  //     move.ifLookedAt(move.booOff),
  //     move.turn.follow.hero,
  //     move.turn.follow,
  //     move.forward(1),
  //   ],
  // },
  blindboo: {
    geometry: 'f',
    sprite: 'blindboo',
    opts: { turns: 3, ethereal: true, sight: 8 }, // TODO sight: friendly tower
    tasks: [
      move.turn.follow.hero,
      move.turn.follow,
      move.forward(1),
    ]
  }
}
