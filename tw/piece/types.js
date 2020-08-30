import bones from './bones'
import { assert } from '../utils'

const types = {
  warrior: {},
}

Object.entries({ bones }).forEach(([_name, lib]) => {
  Object.entries(lib).forEach(([piece_name, piece]) => {
    piece.tasks.forEach((t) =>
      assert(typeof t === 'function', () => {
        console.error(piece.tasks)
        throw `piece ${piece_name} has bad task`
      }),
    )
  })
  Object.assign(types, lib)
})

export default types
