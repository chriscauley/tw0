import { range, pick } from 'lodash'

import Geo from '../Geo'
import { assert } from '../utils'
import { newPiece } from '../piece/entity'

export default class Board {
  constructor({W, H, turn=0}) {
    this.entities = {
      piece: {},
      floor: {},
      team: {},
      path: {},
      wall: {},
      square: {}
    }
    this._piece_id = 0
    Object.assign(this, { W, H })
    this.turn = turn
    this.geo = Geo(W, H)
    this.connectPath()
  }

  setOne(type, index, value) {
    assert(type !== piece, 'cannot set piece with setOne')
    this.entities[type] = value
  }

  getOne = (type, index) => this.entities[type][index]
  getMany = (type, indexes) => indexes.map(i => this.getOne(type, i)).filter(i => i !== undefined)

  setPiece(index, piece) {
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
    delete this.entities.piece[piece.index]
    delete piece.board
  }

  getPieces() {
    return Object.values(this.entities.piece)
  }

  connectPath() {
    const center_xy = this.geo.index2xy(this.geo.CENTER)
    this.start1 = this.geo.xy2index([1, center_xy[1]])
    this.start2 = this.geo.xy2index([this.geo.W - 2, center_xy[1]])
    range(this.start1, this.start2+1).forEach(index => this.entities.path[index] = 1)
    this.geo.indexes.forEach(i => this.entities.square[i] = true)
  }

  newPiece(opts) {
    const piece = newPiece(opts)
    piece.id = ++this._piece_id
    piece._turn = this.game.turn
    this.setPiece(piece.index, piece)
    return piece
  }

}
