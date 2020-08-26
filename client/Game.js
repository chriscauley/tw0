import { applyMove } from './piece/lib'

// import respawn from './player/respawn'
import { assert } from './utils'

// moved these imports down because getMove should probably be in it's own file
// getMove is originally from piece/lib, but was causing circular import
// import { applyBuff } from './move/buff'
import types from './piece/types'
export const getMove = piece => {
  const applyBuff = () => ({})
  let move = applyBuff(piece, {})
  if (move.done) {
    return move
  }
  types[piece.type].tasks.find(task => {
    move = task(piece, move)
    if (move && move.done) {
      return move
    }
  })

  return move
}

export default class Game {
  constructor({board}) {
    this.turn = 0
    this.board = board
    board.game = this
    this.spawnPieces()
  }

  _doTurn(piece) {
    if (piece.dead) {
      return // piece was killed during turn
    }
    const move = getMove(piece)
    if (!move || move.defer) {
      return
    }
    applyMove(piece, move, this.turn)
    this.piece_turns[piece.id]--
    if (move.turns) {
      this.piece_turns[piece.id] += move.turns
      if (this.piece_turns[piece.id] > 100) {
        // This is an easy place to accidentally make an inifinte loop
        throw 'Piece was given too many turns'
      }
    }
    if (move.end) {
      this.piece_turns[piece.id] = 0
    }
  }

  doTurns(pieces, defer) {
    let last_count
    let current_count = 0
    pieces.forEach(p => (p.can_defer = defer))
    while (current_count !== last_count) {
      // first move with deferral until no pieces make a move
      last_count = current_count
      current_count = 0
      pieces.forEach(piece => {
        // everyone takes one turn
        this._doTurn(piece)
        current_count += this.piece_turns[piece.id]
      })
      pieces = pieces.filter(p => this.piece_turns[p.id] > 0)
    }
    if (defer) {
      // Repeat with deferral off
      this.doTurns(pieces, false)
    }
  }

  nextTurn = () => {
    this.busy = true
    // figure out how many turns each piece can take
    this.piece_turns = {}
    const pieces = this.board.getPieces().filter(p => p.type !== 'player')
    pieces.forEach(p => (this.piece_turns[p.id] = p.turns))

    // TODO
    // pieces should eventually handle which team is moving
    // follow(pieces) // #! TODO this takes upto 15ms!
    // this.board.applyFire()
    // this.board.moveFire()
    // this.board.applyFire()
    this.doTurns(pieces, true)
    this.finishTurn()
    this.busy = false
  }

  finishTurn = () => {
    if (this.player && this.player.health <= 0) {
      if (!this.player.lives > 0) {
        this.gameover()
        return
      }
      // respawn(this.player)
    }
    // TODO
    // this.trigger('nextturn')
    this.turn++
    this.spawnPieces()
  }

  spawnPieces() {
    if (this.turn % 20 !== 0) {
      return
    }
    const teams = [1, 2]
    teams.forEach(team => {
      const index = this.board['start' + team]
      const dindex = getPathDindex(this.board, index, team)
      const type = 'skeleton'
      this.board.newPiece({ type, index, dindex })
    })
  }
}

const getPathDindex = (board, index, team) => {
  return team === 1 ? 1 : -1
}