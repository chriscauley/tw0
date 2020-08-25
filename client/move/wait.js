import after from './after'

export default turns => {

  const action = (piece, move) => {
    if (piece.wait === undefined) {
      piece.wait = 0
    }
    if (piece.wait < turns) {
      const tick = piece => piece.wait++
      return {
        now: tick,
        done: true,
      }
    }
    const reset = piece => (piece.wait = 0)
    return after(move, reset)
  }

  action.paint = (piece, _move, _dindex) => [
    {
      index: piece.index,
      sprite: piece.wait >= turns ? 'wait-ready' : 'wait',
    },
  ]

  return action
}
