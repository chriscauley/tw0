import { range } from 'lodash'
import Geo, { numalpha } from '../../client/Geo'

const snapIndexes = (geo, indexes, title) => {
  if (process.argv.includes('-V')) {
    const board = {}
    board[geo.CENTER] = 'X'
    indexes.forEach((index, i) => board[index] = numalpha[i])
    geo.log(board, {empty:'.', title})
  }
  expect(indexes.join(',')).toMatchSnapshot()
}

test('`geo.look(shape, index, dist, dindex)` changes direction with dindex', () => {
  const shapes = ['circle', 'box']
  const geo = Geo(7,7)
  const board = {}
  const index = geo.CENTER
  shapes.forEach(shape => (
    range(1,4).forEach(dist => (
      geo.dindexes.forEach(dindex=> {
        const indexes = geo.look(shape, index, dist, dindex)
        const dir = geo._dindex2name[dindex]
        snapIndexes(geo, indexes, `"${shape}" facing ${dir} at dist ${dist}`)
      })
    ))
  ))
})