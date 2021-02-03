import after from './after'

const wake = (piece, move) => {
  move.priority = 0 // since piece doesn't move, do this move first
  move._woke = !piece.awake
  move.done = true
  after(move, () => {
    piece.awake = true
    piece.wait = 1
  })
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

const wakeUp = (piece, move) => {
  if (piece.board.cache.sound[piece.index] === undefined) {
    // no sounds, go to sleep
    return sleep(piece, move)
  }

  // if not awake, wake up
  return piece.awake ? move : wake(piece, move)
}

wakeUp.onWake = action => (piece, move) => {
  move = wakeUp(piece, move)
  return move._woke ? action(piece, move) : move
}

export default wakeUp