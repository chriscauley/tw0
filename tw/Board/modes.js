import { sortBy } from 'lodash'
import vector from '../Geo/vector'

const { subtract, magnitude } = vector

// this is based off the same algorithm as @unrest/random.
// I was getting repeats so I squared seed and they went away
const M = 0x80000000 - 1 // 2**31 - 1;
const A = 1103515245
const rand = (seed) => (seed * seed * A) % M
rand.choice = (s, array) => array[rand(s) % array.length]

class Disco {
  constructor(board) {
    this.board = board
    board.entities.node[board.options.nodes[0]] = 1
    board.options.nodes.slice(1).forEach((i) => (board.entities.node[i] = 2))
  }
  tick() {
    const { board } = this
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
          tries++
          if (tries > 100) {
            console.error('failed to place peace after 100 tries')
          }
        }
      })
    }
  }
}

class None {
  constructor(board) {
    this.board = board
  }
  tick() {}
}
export default { disco: Disco, none: None }
