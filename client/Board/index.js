import { range, pick, defaults } from 'lodash'

import Geo from '../Geo'
import vector from '../Geo/vector'
import { assert, floodFillPath, floodFillTeam } from '../utils'
import { newPiece } from '../piece/entity'

export default class Board {
  constructor({W, H, turn=0, ...options}) {
    this.entities = {
      piece: {},
      floor: {},
      team: {},
      path: {},
      wall: {},
      square: {}
    }
    this.options = defaults(options, {
      path: getDefaultPath,
      makeWalls: makeDefaultWalls
    })
    this.teams = [1, 2]
    this.cache = {}
    this.dirty = {
      team: true,
      path: true,
    }
    this._piece_id = 0
    Object.assign(this, { W, H })
    this.turn = turn
    this.geo = Geo(W, H)
    this.connectPath()
    this.recache()
  }

  setOne(type, index, value) {
    assert(type !== piece, 'cannot set piece with setOne')
    this.entities[type] = value
  }

  getOne = (type, index) => this.entities[type][index]
  getMany = (type, indexes) => indexes.map(i => this.getOne(type, i)).filter(i => i !== undefined)

  setPiece(index, piece) {
    this.dirty.team = true
    const old = this.entities.piece[index]
    assert(!old || old === piece, 'Pauli Exclusion error')

    if (piece.index !== undefined && piece.board) {
      // remove from old position
      piece.board.removePiece(piece)
    }

    piece.board = this
    piece.index = index
    this.entities.piece[index] = piece
  }

  removePiece(piece) {
    this.dirty.team = true
    delete this.entities.piece[piece.index]
    delete piece.board
  }

  getPieces() {
    return Object.values(this.entities.piece)
  }

  connectPath() {
    let { path, makeWalls } = this.options
    makeWalls(this)
    if (typeof path === 'function') {
      path = path(this)
    }

    this.start1 = path[0]
    this.start2 = path[path.length -1]
    const b = {}
    b[this.start1] = 1
    b[this.start2] = 2
    let last_index = path[0]
    path.slice(1).forEach(next_index => {
      const next_xy = this.geo.index2xy(next_index)
      const last_xy = this.geo.index2xy(last_index)
      const diff_xy = vector.subtract(next_xy, last_xy)
      assert(!(diff_xy[0] && diff_xy[1]), 'Path nodes should be orthogonal')
      const dindex = this.geo.xy2index(vector.sign(diff_xy))
      let i = 0
      while (last_index !== next_index) {
        this.entities.path[last_index] = dindex
        last_index += dindex
        i++
        if (i>1000) {
          throw "Path overflowing"
        }
      }
      this.entities.path[last_index] = dindex
    })

    this.geo.indexes.forEach(i => this.entities.square[i] = true)
  }

  newPiece(opts) {
    this.dirty.team = true
    const piece = newPiece(opts)
    piece.id = ++this._piece_id
    piece._turn = this.game ? this.game.turn : 0
    this.setPiece(piece.index, piece)
    return piece
  }

  recache() {
    if (this.dirty.path) {
      this.cache.path = floodFillPath(this)
    }
    if (this.dirty.team) {
      this.cache.team = {}
      const pieces = this.getPieces()
      this.teams.forEach((team) => {
        this.cache.team[team] = floodFillTeam(this, team)
      })
    }
    this.dirty = {}
  }
}

const getCorners = (board, d) => {
  const geo = board.geo
  return [geo.xy2index([d, d]), geo.xy2index([-d-1, -d])]
}

const getDefaultPath = (board) => {
  const { geo } = board
  const [start, end] = getCorners(board, 2)
  const b = {}
  const start_xy = geo.index2xy(start)
  const end_xy = geo.index2xy(end)
  const out = [start]
  if (start_xy[1] !== end_xy[1]) {
    const mid_x = start_xy[0] + Math.floor((end_xy[0] - start_xy[0])/2)
    out.push(geo.xy2index([mid_x, start_xy[1]]))
    out.push(geo.xy2index([mid_x, end_xy[1]]))
  }
  out.push(end)
  return out
}

const makeDefaultWalls = (board) => {
  const {geo, entities} = board
  const wall_indexes = geo.indexes.filter(i => {
    return (
      i < geo.W ||
        i > geo.AREA - geo.W ||
        i % geo.W === 0 ||
        i % geo.W === geo.W -1
    )
  })
  wall_indexes.forEach(i => entities.wall[i] = 'X')
}