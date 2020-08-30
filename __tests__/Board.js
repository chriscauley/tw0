import Board from '../tw/Board'
import render from '../tw/render/text'

const snap = (board) => {
  const result = render(board, 'piece_type', { extra_layers: ['piece_dindex'] })
  if (process.__UR && process.__UR.V) {
    console.log(result) // eslint-disable-line
  }
  expect(result).toMatchSnapshot()
}

test('2-skull', () => {
  const board = new Board({ W: 8, H: 3, pieces: 'skull' })
  snap(board)
  board.game.nextTurn()
  snap(board)
})

test('9-skull', () => {
  const pieces = [
    [1, 'skull', -6],
    [2, 'skull', -5],
    [1, 'skull', -4],
    [2, 'skull', -1],
    [1, 'skull', 0],
    [2, 'skull', 1],
    [1, 'skull', 4],
    [2, 'skull', 5],
    [1, 'skull', 6],
  ]
  const board = new Board({ W: 5, H: 5, path: [12], pieces })
  snap(board)
  board.game.nextTurn()
  snap(board)
})

test('getDefaultPath', () => {
  const tests = [
    { W: 5, H: 5 },
    { W: 5, H: 10 },
    { W: 10, H: 5 },
    { W: 10, H: 10 },
  ]
  tests.forEach((options) => snap(new Board(options)))
})

test('bonetar-conflicting-attack-move', () => {
  const pieces = [
    [1, 'skeleton', -5],
    [1, 'skeleton', -1],
    [2, 'bonetar', 1],
    [2, 'bonetar', 5],
  ]
  const board = new Board({ W: 5, H: 5, path: [12], pieces })
  snap(board)
  board.game.nextTurn()
  board.game.nextTurn()
  snap(board)
})

test('colliding skulls', () => {
  const board = new Board({ W: 11, H: 5, pieces: 'skull' })
  snap(board)
  board.game.nextTurn()
  board.game.nextTurn()
  snap(board)
})
