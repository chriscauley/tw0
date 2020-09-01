import after from './after'

const wake = (piece, move) => {
  move.done = true
  after(move, () => (piece.awake = true))
  return move
}

const sleep = (piece, move) => {
  move.done = true
  if (piece.awake) {
    after(move, () => {
      delete piece.awake
      delete piece.wait
    })
  }
  return move
}

export default (piece, move) => {
  if (piece.board.cache.sound[piece.index] === undefined) {
    // no sounds, go to sleep
    return sleep(piece, move)
  }

  // if not awake, wake up
  return piece.awake ? move : wake(piece, move)
}