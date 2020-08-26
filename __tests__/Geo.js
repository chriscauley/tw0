import Geo, {numalpha} from '../client/Geo'

test('xy2index', () => {
  const geo = Geo(5, 5)
  const b = {}
  const set = (xy, v) => b[geo.xy2index(xy)] = v
  set([2, 2], 1)
  set([-1,0], 2)
  set([3,-2], 3)
  set([1, 8], 4)
  set([5, 3], 5)
  set([6, 0], 6)
  expect(geo.print(b, {empty:'.'})).toMatchSnapshot()
})