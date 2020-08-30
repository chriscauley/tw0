import { applyMove, applyDamage, canMoveOn } from './piece/lib'
// import respawn from './player/respawn'

// moved these imports down because getMove should probably be in it's own file
// getMove is originally from piece/lib, but was causing circular import
// import { applyBuff } from './move/buff'
import types from './piece/types'
export const getMove = (piece) => {
  const applyBuff = () => ({})
  let move = applyBuff(piece, {})
  if (move.done) {
    return move
  }
  types[piece.type].tasks.find((task) => {
    move = task(piece, move)
    if (move && move.done) {
      return move
    }
  })

  return move
}

export default class Game {
  constructor({ board, id }) {
    this.turn = 0
    this.board = board
    board.game = this
    this.id = id
    // this.spawnPieces()
  }

  doAttacks(attack_moves) {
    let failed
    attack_moves.forEach(([piece, move]) => {
      if (move.index && !canMoveOn(this.board, move.index)) {
        // a piece has moved into this spot during this turn. Retry move.
        failed++
        return
      }
      let piece_moved
      move.damages.forEach((damage) => {
        piece_moved = applyDamage(piece.board, damage) || piece_moved
      })
      if (piece_moved) {
        applyMove(piece, move)
      } else {
        failed++
      }
    })
    if (failed === attack_moves.length) {
      throw 'Unable to resolve attack (infinite loop)'
    }
  }

  doMoves(pieces) {
    // this function happens in waves, first doing colliding enemies, then anyone stepping forward, then everyone else
    // TODO move prioritization here is lacking, but I want to move on to other enemies first
    this.board.recache()
    const piece_moves = pieces.filter((p) => this.piece_turns[p.id]).map((p) => [p, getMove(p)])
    if (!piece_moves.length) {
      return
    }
    const attack_moves = piece_moves.filter((t) => t[1].damages)
    if (attack_moves.length) {
      this.doAttacks(attack_moves)
      this.doMoves(pieces)
      return
    }

    const soft_block = {}
    piece_moves.forEach(([piece, move]) => {
      if (move.index !== undefined) {
        soft_block[move.index] = soft_block[move.index] || []
        soft_block[move.index].push([piece, move])
      }
    })
    const collisions = Object.values(soft_block).filter((pms) => pms.length > 1)
    const forwards = piece_moves.filter(([p, m]) => p.dindex === m.dindex)
    if (collisions.length) {
      collisions.forEach((piece_moves) => {
        const [piece0, move0] = piece_moves[0]
        const team0 = piece0.team
        if (piece_moves.find(([piece, _move]) => piece.team !== team0)) {
          const collide_index = move0.index
          this.board.animate({ type: 'collide', index: move0.index })
          piece_moves.forEach(([piece, move]) => {
            const { index } = piece
            applyDamage(this.board, { index, count: 1 })
            move.done = true
            move.end = true
            move.index = piece.index
            applyMove(piece, move, this.turn)
            piece.index = collide_index
          })
        } else {
          // only move the first piece to avoid friendly collision
          applyMove(piece0, move0, this.turn)
        }
      })
    } else if (forwards.length) {
      forwards.forEach(([piece, move]) => applyMove(piece, move, this.turn))
    } else {
      piece_moves.forEach(([piece, move]) => applyMove(piece, move, this.turn))
    }

    // if some pieces did move and some pieces still can move, try do moves again
    const still_moveable = pieces.filter((p) => this.piece_turns[p.id]).length
    if (still_moveable !== piece_moves.length) {
      this.doMoves(pieces)
    }
  }

  nextTurn = () => {
    this.busy = true
    this.piece_turns = {} // how many turns each piece can take
    this.board.animations = {}
    this.afterturn = []
    const pieces = this.board.getPieces()
    pieces.forEach((p) => {
      this.piece_turns[p.id] = p.turns
      p.last_index = p.index
    })

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
    this.afterturn.forEach((f) => f())
    delete this.afterturn
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
    teams.forEach((team) => {
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
