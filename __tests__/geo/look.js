import Geo from '../../client/Geo'

const snapIndexes = (geo, indexes) => {
  let error
  try {
    expect(indexes.join(',')).toMatchSnapshot()
  } catch (e) {
    error = e
  }
  if (process.argv.includes('-V')) {
    const board = {}
    board[geo.CENTER] = 'X'
    indexes.forEach((index, i) => board[index] = i)
    geo.log(board, {delimiter:'.'})
  }
  if (error) { throw error }
}

test('`geo.look("circle", index, dist, dindex)` changes direction with dindex', () => {
  const geo = Geo(5,5)
  const board = {}
  const index = geo.CENTER
  geo.dindexes.forEach(dindex=> {
    const indexes = geo.look('circle', index, 1, dindex)
    snapIndexes(geo, indexes)
  })
})