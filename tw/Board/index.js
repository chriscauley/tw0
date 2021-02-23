import { defaults, range } from 'lodash'
import assert from 'assert'

import { canMoveOn } from 'tw/piece/lib'
import Game from 'tw/Game'
import Geo from 'tw/Geo'
import vector from 'tw/Geo/vector'
import { floodFillPath, floodFillTeam } from 'tw/utils'
import { newPiece } from 'tw/piece/entity'
import Mode from 'tw/models/Mode'

import sound from './sound'

export const parsePieces = (pieces) => {
  if (Array.isArray(pieces)) {
    throw 'Depracated: pieces should be object, not array'
  }
  if (typeof pieces === 'string') {
    if (!pieces.includes('+')) {
      pieces += '+' + pieces
    }
    const out = { 1: [], 2: [] }
    pieces.split('+').forEach((s, i_team) => {
      const team = i_team + 1
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
          out[team].push([type])
        }
      })
    })
    pieces = out
  }
  return pieces
}

export default class Board {
  constructor({ W, H, turn = 0, ...options }) {
    window.b = this
    this.entities = {
      piece: {},
      floor: {},
      team: {},
      path: {},
      wall: {},
      square: {},
      sound: {},
      node: {},
    }
    this.options = defaults(options, {
      path: getDefaultPath,
      makeWalls: makeDefaultWalls,
      nodes: [],
      mode: 'none',
      level: 1,
    })
    this.level = this.options.level
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
    sound.cache(this)
    this.game = options.game || new Game({ board: this, id: this.options.id })
    Mode.init(this)
    options.player && this.addPlayer(options.player)
    this.quickAddPieces(options.pieces)
    this.animations = {}
    this.recache()
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
    this.dirty.team = true // TOOD I believe recaching is done every step in game so this is redundant
    const old = this.entities.piece[index]
    assert(!old || old === piece, 'Pauli Exclusion error')

    if (piece.index !== undefined && piece.board) {
      // remove from old position
      piece.board.removePiece(piece)
    }

    piece.board = this
    piece.index = index
    piece._indexes.push(index)

    const node_team = this.entities.node[index]
    if (node_team !== undefined && node_team !== piece.team) {
      this.entities.node[index] = piece.team
    }
    this.entities.piece[index] = piece
  }

  removePiece(piece) {
    this.dirty.team = true
    delete this.entities.piece[piece.index]
  }

  getPieces() {
    return Object.values(this.entities.piece)
  }

  // TODO this could be tw/Board/path.build and tw/Board/wall.build
  connectPath() {
    this.entities.node = {}
    this.entities.path = {}
    this.geo.indexes.forEach((i) => (this.entities.square[i] = true))
    const { makeWalls, walls } = this.options

    // walls generated by makeWalls are not stored in options.walls
    makeWalls(this)
    Object.assign(this.entities.wall, walls)

    if (this.options.nodes.length === 0) {
      this.options.nodes = getCorners(this, 3)
    }
    const nodes = this.options.nodes.slice() // clone because we might add one to it
    const first_xy = this.geo.index2xy(nodes[0])
    const last_xy = this.geo.index2xy(nodes[nodes.length - 1])
    this.start1 = nodes[0]
    this.start2 = nodes[nodes.length - 1]
    const half = Math.floor(nodes.length / 2)
    nodes.forEach((index, i) => {
      this.entities.node[index] = i >= half ? 2 : 1
    })
    if (nodes.length > 2 && vector.magnitude(vector.subtract(first_xy, last_xy)) < 8) {
      // nodes wrap around board
      nodes.push(nodes[0])
      this.start2 = nodes[half]
    }
    let last_node = nodes[0]
    // TODO this will break if not orthogonal
    // probably need to insert extra nodes into the temporary list of nodes
    nodes.slice(1).forEach((node) => {
      const xy1 = this.geo.index2xy(last_node)
      const xy2 = this.geo.index2xy(node)
      const dindex = this.geo.floorDindex(last_node - node)
      range(vector.magnitude(vector.subtract(xy1, xy2))).forEach((i_step) => {
        const index = node + i_step * dindex
        this.entities.path[index] = dindex
      })
      last_node = node
    })
  }

  newPiece(opts) {
    this.dirty.team = true
    const piece = newPiece(opts)
    piece.board = this
    piece.id = this.pieces.length + 1
    this.pieces.push(piece)
    piece._turn = this.game ? this.game.turn : 0
    piece._indexes = [] // used in renderer
    this.setPiece(piece.index, piece)
    return piece
  }

  canMoveOn(index) {
    // TODO move canMoveOn into board
    return canMoveOn(this, index)
  }

  getTeamSpawn(team) {
    const start = this['start' + team]
    const team_di = team === 1 ? 1 : -1
    const indexes = [start].concat(this.geo.look('circle', start, 2, team_di))
    const index = indexes.find((i) => canMoveOn(this, i))
    if (index === undefined) {
      throw `cannot place piece for team=${team}`
    }
    return index
  }

  quickAddPieces(pieces = {}) {
    this.parsed_pieces = pieces = parsePieces(pieces)
    Object.entries(pieces).forEach(([team, piece_set]) => {
      team = parseInt(team)
      piece_set.forEach(([type, index]) => {
        const options = { type, team, index }
        if (index === undefined) {
          options.index = this.getTeamSpawn(team)
        }
        this.newPiece(options)
      })
      this.level = Math.max(this.level, this.pieces.filter(p => p.team === team).length)
    })
  }

  getPathDindex(index, team) {
    return (team === 1 ? 1 : -1) * this.cache.path[index].dindex
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
    const { index, type } = animation
    this.animations[index] = this.animations[index] || []
    this.animations[index].push(animation)
    if (type === 'attack') {
      this.entities.sound[index] = 0
    }
  }

  // TODO this should be on game if we want to do multi board (not sure if I want to)
  addPlayer(team) {
    if (team) {
      const index = this.getTeamSpawn(team)
      this.player = this.newPiece({ team, type: 'warrior', player: true, index })
    }
  }

  startTurn() {
    sound.age(this)
    this.animations = {}
    this.getPieces().forEach((p) => (p._indexes = [p.index]))
  }
  cacheSound() {
    sound.cache(this)
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
