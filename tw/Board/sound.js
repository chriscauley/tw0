import { range } from 'lodash'

const MAX_SOUND = 8

const age = (board) => {
  // every turn the sound ages one layer value, and sounds "above" MAX_SOUND die
  const entries = Object.entries(board.entities.sound)
  entries.forEach((il) => il[1]++)
  board.entities.sound = Object.fromEntries(entries.filter((il) => il[1] < MAX_SOUND))
}

const cache = (board) => {
  const cache = (board.cache.sound = {})
  const sound_levels = range(MAX_SOUND).map(() => [])
  Object.entries(board.entities.sound).forEach((il) => sound_levels[il[1]].push(parseInt(il[0])))

  sound_levels.forEach((indexes, level) => {
    // this "junk" next level means no need to check level every time
    const next_level = sound_levels[level + 1] || { push: () => {} }

    indexes.forEach((index) => {
      if (cache[index] === undefined && !board.getOne('wall', index)) {
        cache[index] = level
        board.geo.look('circle', index, 1, 1).forEach((index2) => next_level.push(index2))
      }
    })
  })
}

export default { age, cache, MAX_SOUND }
