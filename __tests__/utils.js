import Board from '../tw/Board'
import { floodFill, floodFillPath } from '../tw/utils'

const snapBoard = (geo, board, title) => {
  const result = geo.print(board, {empty:'.', delimiter: '\t', title})
  if (process.argv.includes('-V')) {
    console.log(result)
  }
  expect(result).toMatchSnapshot()
}

test('floodFillPath', () => {
  const board = new Board({W: 9, H: 9})
  const { geo, cache } = board
  snapBoard(geo, cache.path.fill, 'Distance to nearest path')
  snapBoard(geo, cache.path.dfill, 'Direction to follow path')
  board.newPiece({
    type: 'skeleton',
    team: 1,
    index: board.start1,
    dindex: 1
  })
  board.newPiece({
    type: 'skeleton',
    team: 2,
    index: board.start2,
    dindex: 1
  })
  board.recache()
  snapBoard(geo, cache.team[1].fill, 'Distance to nearest team 1')
  snapBoard(geo, cache.team[1].dfill, 'Direction to nearest team 1')
  snapBoard(geo, cache.team[2].fill, 'Distance to nearest team 2')
  snapBoard(geo, cache.team[2].dfill, 'Direction to nearest team 2')
})