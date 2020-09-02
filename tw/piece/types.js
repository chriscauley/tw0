import bones from './bones'
import bats from './bats'
import { assert } from '../utils'

const types = {
  warrior: {},
  slugs: [],
}

Object.entries({ bats, bones }).forEach(([lib_name, lib]) => {
  Object.entries(lib).forEach(([piece_name, piece]) => {
    piece.tasks.forEach((t) => {
      assert(typeof t === 'function', () => {
        console.error(piece.tasks)
        throw `piece ${piece_name} has bad task`
      })
    })
    types.slugs.push(piece_name)
  })
  Object.assign(types, lib)
  types[lib_name] = lib
})

export default types
