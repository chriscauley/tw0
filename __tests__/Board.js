import Board from '../tw/Board'
import Game from '../tw/Game'
import render from '../tw/render/text'


const Snap = layers => board => {
  const result = render(board, layers)
  if (process.argv.includes('-V')) {
    console.log(result)
  }
}

// TODO snapshots
test('2-skull', () => {
  const snap = Snap(['piece_type', 'piece_dindex'])
  const board = new Board({W: 8, H: 3, path: [9, 14]})
  const game = new Game({ board })
  board.quickAddPieces([
    [1, 'skull'],
    [2, 'skull']
  ])
  snap(board)
  game.nextTurn()
  snap(board)
  game.nextTurn()
  snap(board)
  game.nextTurn()
  snap(board)
})

test('9-skull', () => {
  const snap = Snap(['piece_type', 'piece_dindex'])
  const board = new Board({W: 5, H: 5, path: [12]})
  const game = new Game({ board })
  board.quickAddPieces([
    [1, 'skull', [-1, -1]],
    [2, 'skull', [0, -1]],
    [1, 'skull', [1, -1]],
    [2, 'skull', [-1, 0]],
    [1, 'skull', [0, 0]],
    [2, 'skull', [1, 0]],
    [1, 'skull', [-1, 1]],
    [2, 'skull', [0, 1]],
    [1, 'skull', [1, 1]],
  ])
  snap(board)
  game.nextTurn()
  snap(board)
})