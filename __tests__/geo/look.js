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

test('`geo.look("circle", index, dist, dindex)` changes direction with dindex', () => {
  const geo = Geo(7,7)
  const board = {}
  const index = geo.CENTER
  range(1,2).forEach(dist => {
    geo.dindexes.forEach(dindex=> {
      const indexes = geo.look('circle', index, dist, dindex)
      const dir = geo._dindex2name[dindex]
      snapIndexes(geo, indexes, `"circle" facing ${dir} at dist ${dist}`)
    })
  })
})