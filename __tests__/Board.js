import Board from '../client/Board'
import Game from '../client/Game'
import render from '../client/render/text'


test('Board makes a geo', () => {
  const board = new Board({W: 8, H: 3})
  const game = new Game({ board })
  console.log(render(board))
  game.nextTurn()
  game.nextTurn()
  game.nextTurn()
  game.nextTurn()
  console.log(render(board))
})