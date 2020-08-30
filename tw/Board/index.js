import { defaults } from 'lodash'

import { canMoveOn } from '../piece/lib'
import Game from '../Game'
import Geo from '../Geo'
import vector from '../Geo/vector'
import { assert, floodFillPath, floodFillTeam } from '../utils'
import { newPiece } from '../piece/entity'
import types from '../piece/types'

export const parsePieces = (pieces) => {
  if (typeof pieces === 'string') {
    if (!pieces.includes('|')) {
      pieces += '|' + pieces
    }
    const out = []
    pieces.split('|').forEach((s, i_team) => {
      s.split(',').forEach((s2) => {
        if (!s2) {
          return
        }
        if (!s2.match(/^\d+x/)) {
          s2 = '1x' + s2
        }
        const [_, count, type] = s2.match(/^(\d+)x(.+)/)
        let i = parseInt(count)
        while (i--) {
          out.push([i_team + 1, type])
        }
      })
    })
    pieces = out
  }
  pieces.forEach(([_count, type]) => assert(types[type], `Unknown piece type ${type}`))
  return pieces
}

export default class Board {
  constructor({ W, H, turn = 0, ...options }) {
    this.entities = {
      piece: {},
      floor: {},
      team: {},
      path: {},
      wall: {},
      square: {},
    }
    this.options = defaults(options, {
      path: getDefaultPath,
      makeWalls: makeDefaultWalls,
    })
    this.teams = [1, 2]
    this.cache = {}
    this.dirty = {
      team: true,
      path: true,
    }
    this.pieces = []
    Object.assign(this, { W, H })
    this.turn = turn
    this.geo = Geo(W, H)
    this.dindex = this.geo.dindexes[0]
    this.connectPath()
    this.recache()
    this.game = options.game || new Game({ board: this, id: this.options.id })
    options.player && this.addPlayer(options.player)
    this.quickAddPieces(options.pieces)
    this.animations = {}
  }

  getOne = (type, index) => this.entities[type][index]

  getMany = (type, indexes) =>
    indexes.map((i) => this.getOne(type, i)).filter((i) => i !== undefined)

  setOne(type, index, value) {
    assert(type !== 'piece', 'Use board.setPiece, not board.setOne("piece", ...)')
    this.entities[type] = value
  }

  getPiece = (index) => this.entities.piece[index]

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
  }

  getPieces() {
    return Object.values(this.entities.piece)
  }

  connectPath() {
    this.geo.indexes.forEach((i) => (this.entities.square[i] = true))
    let { path, makeWalls } = this.options
    makeWalls(this)
    if (typeof path === 'function') {
      path = path(this)
    }

    this.start1 = path[0]
    this.start2 = path[path.length - 1]
    if (this.start1 === this.start2 && path.length < 3) {
      this.entities.path[this.start1] = 1
      return
    }
    const b = {}
    b[this.start1] = 1
    b[this.start2] = 2
    let last_index = path[0]
    path.slice(1).forEach((next_index) => {
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
        if (i > 1000) {
          throw 'Path overflowing'
        }
      }
      this.entities.path[last_index] = dindex
    })
  }

  newPiece(opts) {
    this.dirty.team = true
    const piece = newPiece(opts)
    piece.board = this
    piece.id = this.pieces.length
    this.pieces.push(piece)
    piece._turn = this.game ? this.game.turn : 0
    this.setPiece(piece.index, piece)
    return piece
  }

  getTeamSpawn({ team, dindex, ...options }) {
    const start = this['start' + team]
    let index = dindex + start
    const team_di = team === 1 ? 1 : -1
    if (dindex === undefined) {
      const indexes = [start].concat(this.geo.look('circle', start, 2, team_di))
      index = indexes.find((i) => canMoveOn(this, i))
      if (index === undefined) {
        throw `cannot place piece for team=${team} dindex=${dindex}`
      }
    }
    dindex = dindex || this.getPathDindex(index, team)
    return { index, dindex, team, ...options }
  }

  quickAddPieces(pieces = []) {
    pieces = parsePieces(pieces)
    pieces.forEach(([team, type, dindex]) => {
      this.newPiece(this.getTeamSpawn({ team, type, dindex }))
    })
  }

  getPathDindex(index, team) {
    return (team === 1 ? 1 : -1) * this.cache.path.dfill[index]
  }

  recache() {
    if (this.dirty.path) {
      this.cache.path = floodFillPath(this)
    }
    if (this.dirty.team) {
      this.cache.team = {}
      this.teams.forEach((team) => {
        this.cache.team[team] = floodFillTeam(this, team)
      })
    }
    this.dirty = {}
  }

  animate(animation) {
    const { index } = animation
    this.animations[index] = this.animations[index] || []
    this.animations[index].push(animation)
  }

  // TODO this should be on game if we want to do multi board (not sure if I want to)
  addPlayer(team) {
    if (team) {
      this.player = this.newPiece(this.getTeamSpawn({ team, type: 'warrior', player: true }))
    }
  }
}

export const getCorners = (board, d) => {
  const geo = board.geo
  const x = geo.W < d * 2 ? Math.floor(geo.W / 2) : d
  const y = geo.H < d * 2 ? Math.floor(geo.H / 2) : d
  return [geo.xy2index([x, y]), geo.xy2index([-x - 1, -y])]
}

const getDefaultPath = (board) => {
  const { geo } = board
  const [start, end] = getCorners(board, 3)
  const start_xy = geo.index2xy(start)
  const end_xy = geo.index2xy(end)
  const out = [start]
  if (start_xy[0] !== end_xy[0] && start_xy[1] !== end_xy[1]) {
    const mid_x = start_xy[0] + Math.floor((end_xy[0] - start_xy[0]) / 2)
    out.push(geo.xy2index([mid_x, start_xy[1]]))
    out.push(geo.xy2index([mid_x, end_xy[1]]))
  }
  out.push(end)
  return out
}

const makeDefaultWalls = (board) => {
  const { geo, entities } = board
  const wall_indexes = geo.indexes.filter((i) => {
    return i < geo.W || i > geo.AREA - geo.W || i % geo.W === 0 || i % geo.W === geo.W - 1
  })
  wall_indexes.forEach((i) => (entities.wall[i] = 'X'))
}
