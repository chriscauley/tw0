const BASE = {
  damage: 1,
  dist: 1,
  shape: '__f',
  slot: 'weapon',
  splash: 1, // does damage to all squares in shape
}

export default {
  knife: {...BASE},

  longsword: {
    ...BASE,
    dist: 2,
    splash: 2,
    shape: 'f',
  },

  katana: {
    ...BASE,
    shape: 'three',
    splash: 3,
  },

  spear: {
    ...BASE,
    dist: 2,
    step: true,
  },

  scythe: {
    ...BASE,
    dist: 2,
    shape: '__three',
    splash: 3,
    step: true,
  },

  jambiya: {
    ...BASE,
    shape: 'lr',
    splash: 2,
    step: true,
  },
}
