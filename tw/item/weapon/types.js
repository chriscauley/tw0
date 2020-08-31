const BASE = {
  damage: 1,
  dist: 1,
  shape: '__f',
  slot: 'weapon',
  splash: 1, // does damage to all squares in shape
}

const types = {
  knife: {},

  longsword: {
    dist: 2,
    splash: 2,
    shape: 'f',
  },

  katana: {
    shape: 'three',
    splash: 3,
  },

  spear: {
    dist: 2,
    step: true,
  },

  scythe: {
    dist: 2,
    shape: '__three',
    splash: 3,
    step: true,
  },

  jambiya: {
    shape: 'lr',
    splash: 2,
    step: true,
  },
}

const entries = Object.entries(types)
entries.sort()

export default new Map(
  entries.map(([name, type]) => [
    name,
    {
      ...BASE,
      ...type,
      name,
    },
  ]),
)
