import { applyMove, applyDamage, canMoveOn, getMove } from './piece/lib'
import { movePlayer } from './piece/lib/player'
import Buff from 'tw/models/Buff'
import types from './piece/types'

export default class Game {
  constructor({ board, id }) {
    this.turn = 0
    this.board = board
    board.game = this
    this.id = id
  }

  doAttacks(attack_moves) {
    let failed
    attack_moves.forEach(([piece, move]) => {
      if (move.index && !canMoveOn(this.board, move.index)) {
        // damage requires move but another piece has moved into this spot during this turn.
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
    const piece_moves = pieces
      .filter((p) => this.piece_turns[p.id] && p.health > 0)
      .map((p) => [p, getMove(p)])
    if (!piece_moves.length) {
      return
    }
    const attack_moves = piece_moves.filter((t) => t[1].damages)
    if (attack_moves.length) {
      this.doAttacks(attack_moves)
      this.doMoves(pieces)
      return
    }

    let lowest_priority = Infinity
    const soft_block = {}
    piece_moves.forEach(([piece, move]) => {
      move.priority = move.priority || Infinity
      if (move.index !== undefined) {
        lowest_priority = Math.min(lowest_priority, move.priority)
        soft_block[move.index] = soft_block[move.index] || []
        soft_block[move.index].push([piece, move])
      }
    })
    const collisions = Object.values(soft_block).filter((pms) => pms.length > 1)
    if (collisions.length) {
      collisions.forEach((piece_moves) => {
        const [piece0, move0] = piece_moves[0]
        const team0 = piece0.team
        if (piece_moves.find(([piece, _move]) => piece.team !== team0)) {
          const collide_index = move0.index
          this.board.animate({ type: 'collide', index: move0.index })
          piece_moves.forEach(([piece, move]) => {
            this.board.animate({ type: 'attack', index: piece.index, dindex: piece.dindex })
            const { index } = piece
            applyDamage(this.board, { index, count: 1, dindex: -piece.dindex })
            move.done = true
            move.end = true
            move.index = piece.index
            applyMove(piece, move)
            if (piece.dead) {
              piece.index = collide_index
            }
          })
        } else {
          // only move the first piece to avoid friendly collision
          applyMove(piece0, move0)
        }
      })
    } else {
      piece_moves
        .filter((pm) => pm[1].priority <= lowest_priority)
        .forEach((pm) => applyMove(pm[0], pm[1]))
    }

    // if some pieces did move and some pieces still can move, try do moves again
    const still_moveable = pieces.filter((p) => this.piece_turns[p.id]).length
    if (still_moveable !== piece_moves.length) {
      this.doMoves(pieces)
    }
  }

  applyBuffs() {
    this.board.getPieces().filter(p => p.buff).forEach(p => Buff.apply(p))
  }

  nextTurn = () => {
    this.busy = true

    // clear everything
    this.piece_turns = {} // how many turns each piece can take
    this.afterturn = []
    this.board.startTurn()
    if (this.player_move) {
      this.board.player._indexes = [this.board.player.index]
      movePlayer(this.board.player, this.player_move)
      delete this.player_move
    }
    this.board.cacheSound()
    const pieces = this.board.getPieces().filter((p) => !p.player)
    pieces.forEach((p) => {
      this.piece_turns[p.id] = p.turns
    })

    this.applyBuffs()
    this.doMoves(pieces)

    this.finishTurn()
    this.busy = false
  }

  finishTurn = () => {
    if (this.board.player && this.board.player.health <= 0) {
      if (!this.board.player.lives > 0) {
        this.gameover()
        return
      }
    }

    // after every turn, blood armor decays
    this.board.pieces.forEach(p => (p.blood_armor > 0) && p.blood_armor --)

    this.afterturn.forEach((f) => f())
    delete this.afterturn
    this.board.mode.tick()
    this.turn++
  }

  pressSpace = (e, callback) => {
    e.preventDefault()
    if (this.board.player && this.board.player.health <= 0) {
      return
    }
    this.nextTurn()
    callback()
  }

  pressArrow = (e, callback) => {
    e.preventDefault()
    if (!this.board.player || this.board.player.health <= 0) {
      return
    }
    const key = e.key.replace('Arrow', '')[0].toLowerCase()
    const dindex = this.board.geo._name2dindex[key]
    this.player_move = { dindex }
    this.nextTurn()
    callback()
  }
}
