const { range } = require('lodash')
const alpha = 'abcdefghijklmnopqrstuvwxyz'
const ALPHA = alpha.toUpperCase()
const numbers = '0123456789'
export const alphabet = alpha.split('')
export const alphanum = (alpha+ALPHA+numbers).split('')
export const numalpha = (numbers+alpha+ALPHA).split('')

const mod = (n, d) => ((n % d) + d) % d
export const SHAPES = []

const Shapes = (geo) => ({
  box: (dist, dindex) => {
    const out = []
    const o_dindex = geo.rot_dindexes[dindex][1]

    // top row
    range(-dist, dist+1).forEach(i => out.push(dist * dindex - i * o_dindex))

    // left and right sides in middle
    range(1, 2*dist).forEach(i => {
      out.push((dist-i) * dindex + o_dindex * dist)
      out.push((dist-i) * dindex - o_dindex * dist)
    })

    // bottom row
    range(-dist, dist+1).forEach(i => out.push(-dist * dindex - i * o_dindex))
    return out
  },
  circle: (dist, dindex) => {
    const out = []
    const o_dindex = geo.rot_dindexes[dindex][1]
    out.push(dindex * dist)
    range(1, dist+1).forEach(i => {
      out.push(dindex*(dist-i) - o_dindex * i)
      out.push(dindex*(dist-i) + o_dindex * i)
    })
    range(1, dist).forEach(i => {
      out.push(-dindex*(dist-i) - o_dindex * i)
      out.push(-dindex*(dist-i) + o_dindex * i)
    })
    out.push(dindex * -dist)
    return out
  },
  three: (dist, dindex) => {
    const target = dist*dindex
    const o_dindex = geo.rot_dindexes[dindex][1]
    return [target, target + o_dindex, target - o_dindex]
  },
  cone: (dist, dindex) => {
    const target = dist*dindex
    const out = [target]
    const o_dindex = geo.rot_dindexes[dindex][1]
    range(1, dist).forEach(o_dist => {
      out.push(target + o_dist * o_dindex)
      out.push(target - o_dist * o_dindex)
    })
    return out
  },
})

Object.keys(Shapes()).forEach(shape => {
  SHAPES.push('__'+shape)
  SHAPES.push(shape)
})

const Look = (geo) => {
  const shapes = Shapes(geo)
  const make = (shape, dist) => {
    const R = 1
    if (look[shape][R][dist]) {
      return
    }
    if (dist > 0 && !look[shape][R][dist - 1]) {
      make(shape, dist - 1)
    }
    if (shape.startsWith('__')) {
      // dunder means "outer shell of look"
      geo.dindexes.forEach(dindex => {
        look[shape][dindex][dist] = shapes[shape.slice(2)](dist, dindex)
      })
    } else {
      if (!look['__' + shape][R][dist]) {
        // need outer shells to make filled looks
        make('__' + shape, dist)
      }
      geo.dindexes.forEach(dindex => {
        look[shape][dindex][dist] = []
        range(dist + 1).forEach((_dist) => {
          look[shape][dindex][dist] = look[shape][dindex][dist].concat(look['__' + shape][dindex][_dist])
        })
      })
    }
  }

  const look = (shape, index, dist, dindex) => {
    if (!look[shape][dindex]) {
      throw Error(`Invalid dindex: ${dindex}`)
    }
    make(shape, dist) // idempotent
    return look[shape][dindex][dist].map((dindex) => index + dindex)
  }

  SHAPES.forEach((shape) => {
    look[shape] = {}
    geo.dindexes.forEach(dindex => {
      look[shape][dindex] = [[]] // all geometries only see nothing at range 0
    })
    make(shape, 1)
  })

  look.inBounds = (shape, index, dist) => {
    // like look, but won't cross out of bounds
    const x0 = geo.index2xy(index)[0]
    const xys = look(shape, index, dist)
      .map((i) => geo.index2xy(i))
      .filter(
        (xy) =>
          Math.abs(xy[0] - x0) <= dist &&
          xy[1] < geo.H &&
          xy[1] >= geo.y0 &&
          xy[1] < geo.y0 + geo.H,
      )
    return xys.map((xy) => geo.xy2index(xy))
  }

  return look
}

const geo_cache = {}

const Geo = (x0, x_max, y0, y_max) => {
  const key = `${x0},${x_max},${y0},${y_max}`
  if (geo_cache[key]) {
    return geo_cache[key]
  }
  if (x_max === undefined) {
    x_max = x0
  }
  if (y0 === undefined) {
    y_max = x_max - 1
    x_max = x0 - 1
    x0 = 0
    y0 = 0
  }

  const W = Math.abs(x_max - x0) + 1
  const H = Math.abs(y_max - y0) + 1

  const geo = geo_cache[key] = {
    x0,
    y0,
    W,
    H,
    xys: [],
    indexes: [],
    AREA: W * H,
    _dindex_names: ['u', 'l', 'r', 'd',],
    _dindex_chars: ['^', '<', '>', 'v',],
    _dindex2char: {},
    _name2dindex: {},
    _dindex2name: {},
    dindexes: [-W, -1, 1, W ], // u, l, r, d
    rot_dindexes: {
      [-W]: [-W, -1, 1, W ], // u, l, r, d
      [W]: [W, 1, -1, -W ], // d, l, r, u
      [1]: [1, -W, W, -1], // r, u, d, l
      [-1]: [-1, W, -W, 1], // l, d, u, r
    },
    index2xy: (i) => [mod(i, W), Math.floor(i / W)],
    xy2index: (xy) => mod(xy[0] + xy[1] * W, geo.AREA),
    print(board, {from_xy=[x0,y0], to_xy=[x_max, y_max], delimiter='',empty=' ', extras, title}={}) {
      const xs = range(from_xy[0], to_xy[0]+1)
      const ys = range(from_xy[1], to_xy[1]+1)
      const lines = ys.map((y) => (
        xs.map((x) => board[this.xy2index([x, y])])
          .map(s => s=== undefined ? empty : s)
          .join(delimiter)
      ))
      if (extras) {
        extras.forEach((e, i) => lines[i] += '\t' + e)
      }
      title && lines.unshift(title)
      return lines.join('\n')
    },
    log: (board, options) => console.log(geo.print(board, options)),
    inBounds(xy) {
      return xy[0] >= x0 && xy[0] < x0 + W && xy[1] >= y0 && xy[1] < y0 + H
    },
    slice(xy, W, H) {
      const out = []
      const ys = range(xy[1], xy[1] + H)
      const xs = range(xy[0], xy[0]+W)
      ys.forEach(
        y => xs.forEach(
          x=> out.push(geo.xy2index([x,y]))
        )
      )
      return out
    },
  }

  geo.dindexes.forEach((dindex, i) => {
    const name = geo._dindex_names[i]
    geo._dindex2name[dindex] = name
    geo._name2dindex[name] = dindex
    geo._dindex2char[dindex] = geo._dindex_chars[i]
  })

  geo.CENTER = geo.xy2index([Math.floor((geo.x0+geo.W)/2), Math.floor((geo.y0+geo.H)/2)])

  range(y0, y_max+1).forEach(
    y => range(x0, x_max+1).forEach(
      x => {
        const xy = [x,y]
        geo.xys.push()
        geo.indexes.push(geo.xy2index(xy))
      }
    )
  )

  geo.look = Look(geo)
  return geo
}
const assert = (bool, exception) => {
  if (!bool) {
    throw exception
  }
}

const log = (...args) => {
  if (log.isOn()) {
    console.log(...args)
  }
}

log.isOn = () => process.argv.includes('-v')

const answer = (text, value, expected) => {
  if (expected !== undefined) {
    assert(value === expected, `Bad answer for ${text}, ${value} !== ${expected}`)
  }
  console.log(text, value)
}

// eslint-disable-next-line
export default Geo
//   numalpha,
//   alphanum,
//   alphabet: alphanum.slice(0,26),
//   Geo,
//   assert,
//   log,
//   answer,
//   mod,
// }
