import { range } from 'lodash'

import Geo from '../tw/Geo'
import Shapes from '../tw/Geo/Shapes'
import { numalpha } from '../tw/render/text'

const snap = (board, options) => {
  const output = board.geo.print(board, options)
  if (process.__UR && process.__UR.V) {
    console.log(output) // eslint-disable-line
  }
  expect(output).toMatchSnapshot()
}

test('xy2index', () => {
  const geo = Geo(5, 5)
  const b = { geo }
  const set = (xy, v) => (b[geo.xy2index(xy)] = v)
  set([2, 2], 1)
  set([-1, 0], 2)
  set([3, -2], 3)
  set([1, 8], 4)
  set([5, 3], 5)
  set([6, 0], 6)
  snap(b)
})

Shapes.list
  .filter((s) => s.startsWith('__'))
  .forEach((shape) => {
    test('look.' + shape, () => {
      range(3).forEach((i_dindex) => {
        range(1, 5).forEach((dist) => {
          const geo = Geo(dist * 2 + 1)
          const board = { geo }
          const dindex = geo.dindexes[i_dindex]
          const indexes = geo.look(shape, geo.CENTER, dist, dindex)
          indexes.forEach((index, i) => (board[index] = numalpha[i] || '!'))
          const title = `${shape} ${dist} ${geo._dindex2name[dindex]}`
          snap(board, { title })
        })
      })
    })
  })
