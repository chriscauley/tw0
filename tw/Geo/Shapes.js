import { range } from 'lodash'

const Shapes = (geo) => ({
  circle: (dist, dindex) => {
    const out = []
    const o_dindex = geo.rot_dindexes[dindex][1]
    out.push(dindex * dist)
    range(1, dist + 1).forEach((i) => {
      out.push(dindex * (dist - i) - o_dindex * i)
      out.push(dindex * (dist - i) + o_dindex * i)
    })
    range(1, dist).forEach((i) => {
      out.push(-dindex * (dist - i) - o_dindex * i)
      out.push(-dindex * (dist - i) + o_dindex * i)
    })
    out.push(dindex * -dist)
    return out
  },
  box: (dist, dindex) => {
    const out = []
    const o_dindex = geo.rot_dindexes[dindex][1]

    // top row
    range(-dist, dist + 1).forEach((i) => out.push(dist * dindex - i * o_dindex))

    // left and right sides in middle
    range(1, 2 * dist).forEach((i) => {
      out.push((dist - i) * dindex + o_dindex * dist)
      out.push((dist - i) * dindex - o_dindex * dist)
    })

    // bottom row
    range(-dist, dist + 1).forEach((i) => out.push(-dist * dindex - i * o_dindex))
    return out
  },
  three: (dist, dindex) => {
    const target = dist * dindex
    const o_dindex = geo.rot_dindexes[dindex][1]
    return [target, target + o_dindex, target - o_dindex]
  },
  cone: (dist, dindex) => {
    const target = dist * dindex
    const out = [target]
    const o_dindex = geo.rot_dindexes[dindex][1]
    range(1, dist).forEach((o_dist) => {
      out.push(target + o_dist * o_dindex)
      out.push(target - o_dist * o_dindex)
    })
    return out
  },
})

Shapes.list = []

Object.keys(Shapes()).forEach((shape) => {
  Shapes.list.push('__' + shape)
  Shapes.list.push(shape)
})

export default Shapes
