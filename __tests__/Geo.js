import { range } from 'lodash'
import Geo, {numalpha, SHAPES} from '../tw/Geo'

const snap = (board, options) => {
  const output = board.geo.print(board, options)
  if (process.argv.includes('-V')) {
    console.log(output)
  }
  expect(output).toMatchSnapshot()
}

test('xy2index', () => {
  const geo = Geo(5, 5)
  const b = {geo}
  const set = (xy, v) => b[geo.xy2index(xy)] = v
  set([2, 2], 1)
  set([-1,0], 2)
  set([3,-2], 3)
  set([1, 8], 4)
  set([5, 3], 5)
  set([6, 0], 6)
  snap(b)
})

test('Look', () => {
  const _test = (geo, shape, dist, dindex) => {
    const indexes = geo.look(shape, geo.CENTER, dist, dindex)
    const board = {geo}
    indexes.forEach((index, i) => board[index] = numalpha[i] || '!')
    const title = `${shape} ${dist} ${geo._dindex2name[dindex]}`
    snap(board, {title})
  }
  range(1,5).forEach(dist => {
    const geo = Geo(dist*2+1)
    geo.dindexes.forEach(dindex => {
      SHAPES.forEach(shape => {
        _test(geo, shape, dist, dindex)
      })
    })
  })
})