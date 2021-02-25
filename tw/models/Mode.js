import { sortBy } from 'lodash'
import vector from '../Geo/vector'

const { subtract, magnitude } = vector

// TODO compare to tw/random
// this is based off the same algorithm as @unrest/random.
// I was getting repeats so I squared seed and they went away
const M = 0x80000000 - 1 // 2**31 - 1;
const A = 1103515245
const rand = (seed) => (seed * seed * A) % M
rand.choice = (s, array) => array[rand(s) % array.length]

const disco = {
  init(board) {
    board.entities.node[board.options.nodes[0]] = 1
    board.options.nodes.slice(1).forEach((i) => (board.entities.node[i] = 2))
  },
  tick(board) {
    if (!Object.values(board.entities.node).find((team) => team === 2)) {
      board.level++
      const pieces = [...board.parsed_pieces[2]]
      let i = 0
      while (pieces.length < board.level) {
        pieces.push(pieces[i%pieces.length])
        i++
      }
      // blue controls all the nodes, switch all but closest node to red and respawn red pieces
      const player_xy = board.geo.index2xy(board.player.index)
      const nodes = sortBy(
        Object.keys(board.entities.node).map((n) => parseInt(n)),
        (i) => magnitude(subtract(player_xy, board.geo.index2xy(i))),
      ).slice(1)

      const dindexes = board.geo.look('box', 0, 3, 1)

      nodes.forEach((node_index, i) => {
        board.entities.node[node_index] = 2
        let tries = 0
        while (pieces.length) {
          const index = node_index + rand.choice(board.turn * node_index + tries + i, dindexes)
          if (board.canMoveOn(index)) {
            board.newPiece({ team: 2, type: pieces.pop(), index })
          }
          if (tries > 100) {
            throw 'failed to place piece after 100 tries'
          }
          tries++
        }
      })
    }
  }
}

const soccer = {
  init(board) {
    // add goals
    const y = Math.floor(board.H/2)
    const index = board.geo.xy2index([1,y])
    board.entities.floor[index] = { type: 'goal', index }
  },
  tick(board) {
    if (board.getPieces().filter(p => p.type === 'ball').length !== 0) {
      return
    }
    board.level++
    // if no balls, spawn balls
    const { H, W } = board
    const center_x = Math.floor(W/2)
    const ys = [1, 2, H-2, H-2]
    const xs = [center_x-1, center_x, center_x+1]
    let tries = 0
    while (board.getPieces().filter(p => p.type === 'ball').length < board.level) {
      const x = rand.choice(board.turn * board.level + tries, xs)
      const y = rand.choice(board.turn * board.level - tries, ys)
      const index = board.geo.xy2index([x, y])
      if (board.canMoveOn(index)) {
        const dindex = (y > 2 ? -1 : 1) * W // up or down
        board.newPiece({ team: 2, type: 'ball', index, dindex })
      }
      if (tries > 100) {
        throw 'failed to place piece after 100 tries'
      }
      tries ++
    }
  },
}

const modes = { disco, none: {}, soccer }

export default {
  init(board) {
    modes[board.options.mode]?.init?.(board)
  },
  tick(board) {
    modes[board.options.mode]?.tick?.(board)
  },
}
