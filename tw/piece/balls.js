import move from 'tw/move'

export default {
  ball: {
    opts: { health: 2 ** 20 },
    tasks: [move.ifHit(move.turn.fromHit), move.forward.collide],
  },
  discoball: {
    sprite: 'ball-disco',
    sprites: ['ball-disco.active'],
    opts: { health: 2 ** 20 },
    onHit: [move.buff.add('active', 1)],
    tasks: [],
  },
}
