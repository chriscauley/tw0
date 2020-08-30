import { range } from 'lodash'

import { mod } from '../utils'
import Look from './Look'

const geo_cache = {}

export default (x0, x_max, y0, y_max) => {
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

  const geo = (geo_cache[key] = {
    x0,
    y0,
    W,
    H,
    xys: [],
    indexes: [],
    AREA: W * H,
    _dindex_names: ['u', 'l', 'r', 'd'],
    _dindex_chars: ['^', '<', '>', 'v'],
    _dindex2char: {},
    _name2dindex: {},
    _dindex2name: {},
    dindexes: [-W, -1, 1, W], // u, l, r, d
    rot_dindexes: {
      [-W]: [-W, -1, 1, W], // u, l, r, d
      [W]: [W, 1, -1, -W], // d, l, r, u
      [1]: [1, -W, W, -1], // r, u, d, l
      [-1]: [-1, W, -W, 1], // l, d, u, r
    },
    index2xy: (i) => [mod(i, W), Math.floor(i / W)],
    xy2index: (xy) => mod(xy[0] + xy[1] * W, geo.AREA),
    print(
      board,
      {
        from_xy = [x0, y0],
        to_xy = [x_max, y_max],
        delimiter = '',
        empty = ' ',
        extras,
        title,
      } = {},
    ) {
      const xs = range(from_xy[0], to_xy[0] + 1)
      const ys = range(from_xy[1], to_xy[1] + 1)
      const lines = ys.map((y) =>
        xs
          .map((x) => board[this.xy2index([x, y])])
          .map((s) => (s === undefined ? empty : s))
          .join(delimiter),
      )
      if (extras) {
        extras.forEach((e, i) => (lines[i] += '\t' + e))
      }
      title && lines.unshift(title)
      return lines.join('\n')
    },
    inBounds(xy) {
      return xy[0] >= x0 && xy[0] < x0 + W && xy[1] >= y0 && xy[1] < y0 + H
    },
    slice(xy, W, H) {
      const out = []
      const ys = range(xy[1], xy[1] + H)
      const xs = range(xy[0], xy[0] + W)
      ys.forEach((y) => xs.forEach((x) => out.push(geo.xy2index([x, y]))))
      return out
    },
    floorDindex(dindex) {
      // if dindex is a multiple of W it is in thy y direction
      // otherwise it is in the x direction
      return (dindex % W === 0 ? W : 1) * Math.sign(dindex)
    },
  })

  geo.dindexes.forEach((dindex, i) => {
    const name = geo._dindex_names[i]
    geo._dindex2name[dindex] = name
    geo._name2dindex[name] = dindex
    geo._dindex2char[dindex] = geo._dindex_chars[i]
  })

  geo.CENTER = geo.xy2index([Math.floor((geo.x0 + geo.W) / 2), Math.floor((geo.y0 + geo.H) / 2)])

  range(y0, y_max + 1).forEach((y) =>
    range(x0, x_max + 1).forEach((x) => {
      const xy = [x, y]
      geo.xys.push(xy)
      geo.indexes.push(geo.xy2index(xy))
    }),
  )

  geo.look = Look(geo)
  return geo
}
