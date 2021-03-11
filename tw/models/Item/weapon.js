import { defaults } from 'lodash'

const BASE = {
  damage: 1,
  dist: 1,
  step: false,
}

const items = {
  knife: {},

  longsword: {
    hitbox: { dist: 2, shape: 'f' },
  },

  spear: {
    hitbox: { shape: '__f', dist: 2 },
    step: true,
  },

  scythe: {
    hitbox: { shape: '__ds', dist: 2 },
    splash: { shape: '__three', dist: 2 },
    step: true,
  },

  katana: {
    hitbox: { shape: '__f', dist: 2 },
    splash: { shape: '__three', dist: 2 },
    step: true,
  },

  jambiya: {
    hitbox: { shape: '__ds', dist: 1 },
    step: true,
  },
}

Object.values(items).forEach((item) => {
  defaults(item, {
    damage: 1,
    step: false,
    hitbox: { shape: '__f', dist: 1 },
  })
  item.splash = item.splash || item.hitbox
})

export default items