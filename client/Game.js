import { applyMove, applyDamage } from './piece/lib'
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
    // this.spawnPieces()
  }

  doAttacks(pieces) {
    this.board.recache()
    const piece_moves = pieces.map(p => [p, getMove(p)])
    const attack_moves = piece_moves.filter(t => t[1].damages)
    const failed_pieces = []
    attack_moves.forEach(([piece, move]) => {
      let piece_moved
      move.damages.forEach((damage) => {
        const result = applyDamage(piece.board, damage)
        if (result) {
          piece_moved = true
        }
      })
      if (piece_moved) {
        this.piece_turns[piece.id] --
        if (move.index || move.dindex) {
          // there needs to be some kind of conflict resolution here
          throw "Not implemented: attack+move"
        }
        applyMove(piece, move)
      } else {
        failed_pieces.push(piece)
      }
    })
    if (failed_pieces.length) {
      if (failed_pieces.length === pieces.length) {
        throw "Unable to resolve attack (infinite loop)"
      }
      this.doAttacks(failed_pieces)
    }
  }

  doMoves(pieces) {
    this.board.recache()
    const piece_moves = pieces.filter(p => this.piece_turns[p.id]).map(p => [p, getMove(p)])
    const hard_block = {}
    const soft_block = {}
    pieces.filter(p => this.piece_turns[p.id] <= 0).forEach(p => {
      hard_block[p.index] = true
    })
    piece_moves.forEach(([piece, move]) => {
      if (move.index === undefined) {
        applyMove(piece, move)
        this.piece_turns[piece.id]--
        hard_block[piece.index] = true
      } else {
        soft_block[piece.index] = soft_block[piece.index] || []
        soft_block[piece.index].push([piece, move])
      }
    })
    Object.entries(soft_block).forEach(([index, piece_moves]) => {
      if (piece_moves.length > 1) {
        throw "NotImplemented: conflicting moves"
      } else {
        const [piece, move] = piece_moves[0]
        applyMove(piece, move)
        this.piece_turns[piece.id]--
      }
    })
  }

  nextTurn = () => {
    this.busy = true
    // figure out how many turns each piece can take
    this.piece_turns = {}
    const pieces = this.board.getPieces()
    pieces.forEach(p => (this.piece_turns[p.id] = p.turns))

    this.doAttacks(pieces)
    this.doMoves(pieces)
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
    // this.spawnPieces()
  }

  // TODO turned off until I figure out logic for game mode
  spawnPieces() {
    if (this.turn % 20 !== 0) {
      return
    }
    const teams = [1, 2]
    teams.forEach(team => {
      const index = this.board['start' + team]
      const dindex = getPathDindex(this.board, index, team)
      const type = 'skull'
      this.board.newPiece({ type, index, dindex, team })
    })
  }
}

const getPathDindex = (board, index, team) => {
  return team === 1 ? 1 : -1
}