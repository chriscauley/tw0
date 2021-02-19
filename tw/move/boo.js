import after from './after'

export default {
  off: (piece, move) => {
    move = after(move, () => {
      piece._sprite = ' hide'
      piece.invulnerable = true
    })
    return {
      ...move,
      done: true,
    }
  },
  on: (piece, move) => {
    return after(move, () => {
      piece._sprite = ''
      piece.invulnerable = false
    })
  }
}