const { range } = require('lodash')
const alpha = 'abcdefghijklmnopqrstuvwxyz'
const ALPHA = alpha.toUpperCase()
const numbers = '0123456789'
export const alphabet = alpha.split('')
export const alphanum = (alpha+ALPHA+numbers).split('')
export const numalpha = (numbers+alpha+ALPHA).split('')

const mod = (n, d) => ((n % d) + d) % d

const Look = (geo) => {
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
        look[shape][dindex][dist] = shapes[shape.slice(2)](dist)
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

  const shapes = {
    box: (dist) => {
      const out = []
      geo.dindexes.forEach((dindex, i) => {
        const o_dindex = geo.dindexes[(i + 1) % geo.dindexes.length] // orthogonal direction
        range(dist * 2 + 1).forEach((o_dist) => {
          out.push(dist * dindex + o_dist * o_dindex)
        })
        out.pop() // last corner is repeated
      })
      return out
    },
    circle: (dist) => {
      const out = []
      geo.dindexes.forEach((dindex, i) => {
        out.push(dindex * dist)
        const o_dindex = geo.dindexes[(i + 1) % geo.dindexes.length] // orthogonal direction
        range(1, dist).forEach((o_dist) =>
          out.push((dist - o_dist) * dindex + o_dist * o_dindex),
        )
      })
      return out
    },
  }

  const look = (shape, index, dist, dindex) => {
    if (!look[shape][dindex][dist]) {
      make(shape, dist)
    }
    return look[shape][dindex][dist].map((dindex) => index + dindex)
  }

  Object.keys(shapes).forEach((shape) => {
    look[shape] = {}
    look['__' + shape] = {}
    geo.dindexes.forEach(dindex => {
      look[shape][dindex] = [[]] // all geometries only see nothing at range 0
      look['__' + shape][dindex] = [[]]
    })
    make(shape, 1)
  })

  look.inBounds = (shape, index, dist) => {
    // like look, but won't cross out of bounds
    const x0 = geo.i2xy(index)[0]
    const xys = look(shape, index, dist)
      .map((i) => geo.i2xy(i))
      .filter(
        (xy) =>
          Math.abs(xy[0] - x0) <= dist &&
          xy[1] < geo.H &&
          xy[1] >= geo.y0 &&
          xy[1] < geo.y0 + geo.H,
      )
    return xys.map((xy) => geo.xy2i(xy))
  }

  return look
}

const Geo = (x0, x_max, y0, y_max) => {
  if (y0 === undefined) {
    y_max = x_max - 1
    x_max = x0 - 1
    x0 = 0
    y0 = 0
  }

  const W = Math.abs(x_max - x0) + 1
  const H = Math.abs(y_max - y0) + 1

  const geo = {
    x0,
    y0,
    W,
    H,
    xys: [],
    indexes: [],
    AREA: W * H,
    dindexes: [-W, -1, 1, W ], // u, l, r, d
    rot_dindexes: {
      [-W]: [-W, -1, 1, W ], // u, l, r, d
      [W]: [W, 1, -1, -W ], // d, l, r, u
      [1]: [1, -W, W, -1], // r, u, d, l
      [-1]: [-1, W, -W, 1], // l, d, u, r
    },
    i2xy: (i) => [mod(i, W), Math.floor(i / W)],
    xy2i: (xy) => xy[0] + xy[1] * W,
    print(board, {from_xy=[x0,y0], to_xy=[x_max, y_max], delimiter='',empty=' ', extras, title}={}) {
      const xs = range(from_xy[0], to_xy[0]+1)
      const ys = range(from_xy[1], to_xy[1]+1)
      const lines = ys.map((y) => (
        xs.map((x) => board[this.xy2i([x, y])])
          .map(s => s=== undefined ? empty : s)
          .join(delimiter)
      ))
      if (extras) {
        extras.forEach((e, i) => lines[i].push('  ' + e))
      }
      title && lines.unshift(title)
      return lines.join('\n')
    },
    log: (board, options) => console.log(geo.print(board, options)),
    makeBoard(xys, values = []) {
      const board = {}
      xys.forEach((xy, i) => {
        board[this.xy2i(xy)] = values[i] || i
      })
      return board
    },
    inBounds(xy) {
      return xy[0] >= x0 && xy[0] < x0 + W && xy[1] >= y0 && xy[1] < y0 + H
    },
    eachXY(f) {
      console.warn('eachXY is depracated, use geo.xys.forEach instead')
      range(x0, x_max+1).forEach(
        x => range(y0, y_max+1).forEach(
          y => f([x,y])
        )
      )
    },
    slice(board, xy, W, H, _default) {
      const out = []
      const ys = range(xy[1], xy[1] + H)
      range(xy[0], xy[0]+W).forEach(
        x => ys.forEach(
          y => {
            const v = board[geo.xy2i([x,y])]
            out.push(v === undefined ? _default : v)
          }
        )
      )
      return out
    },
  }

  geo.CENTER = geo.xy2i([Math.floor((geo.x0+geo.W)/2), Math.floor((geo.y0+geo.H)/2)])

  geo._wrapped_dindexes = geo.dindexes.concat(geo.dindexes)
  geo.dindexes.forEach((dindex, i) => {
    geo.rot_dindexes[dindex] = geo._wrapped_dindexes.slice(i, i+geo.dindexes.length)
  })

  range(x0, x_max+1).forEach(
    x => range(y0, y_max+1).forEach(
      y => {
        const xy = [x,y]
        geo.xys.push()
        geo.indexes.push(geo.xy2i(xy))
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
