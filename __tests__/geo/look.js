import { range } from 'lodash'
import Geo from '../../tw/Geo'
import { numalpha } from '../../tw/render/text'

const snapIndexes = (geo, indexes, title) => {
  if (process.__UR && process.__UR.V) {
    const board = {}
    board[geo.CENTER] = 'X'
    indexes.forEach((index, i) => (board[index] = numalpha[i]))
    geo.log(board, { empty: '.', title })
  }
  expect(indexes.join(',')).toMatchSnapshot()
}

test('`geo.look(shape, index, dist, dindex)` changes direction with dindex', () => {
  const shapes = ['circle', 'box']
  const geo = Geo(7, 7)
  const index = geo.CENTER
  shapes.forEach((shape) =>
    range(1, 4).forEach((dist) =>
      geo.dindexes.forEach((dindex) => {
        const indexes = geo.look(shape, index, dist, dindex)
        const dir = geo._dindex2name[dindex]
        snapIndexes(geo, indexes, `"${shape}" facing ${dir} at dist ${dist}`)
      }),
    ),
  )
})
