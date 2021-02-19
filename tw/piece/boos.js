import move from 'tw/move'

const tasks = [
  move.ifLookedAt(move.boo.off),
  move.boo.on,
  move.attackNearby('circle', 1),
  move.turn.follow,
  move.forward(1)
]

export default {
  boo: {
    geometry: 'f',
    opts: { sight: 4 },
    sprite: 'shade-wisp',
    tasks,
  },
  boo2: {
    geometry: 'f',
    sprite: 'shade',
    opts: { turns: 2, sight: 4 },
    tasks,
  },
  boohoo: {
    geometry: 'f',
    sprite: 'shee',
    opts: { turns: 3, health: 3, sight: 4 },
    tasks: [
      // move.ifHit(move.teleport(4)),
      ...tasks
    ],
  },
  blindboo: {
    sprite: 'eye',
    sprites: ['eye.ethereal'],
    geometry: 'f',
    opts: { turns: 3, ethereal: true, sight: 4 }, // TODO sight: friendly tower
    tasks: [
      move.turn.follow,
      move.attackNearby('circle', 1),
      move.forward(1),
    ]
  }
}
