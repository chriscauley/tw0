import after from './after'
import ifLookedAt from './ifLookedAt'

const booOff = (piece, move) => after.done(move, () => {
  piece._sprite = ' hide'
  piece.invulnerable = true
})

const booOn = (piece, move) => after(move, () => {
  piece._sprite = ''
  piece.invulnerable = false
})

export default ifLookedAt(booOff, booOn)
