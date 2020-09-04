import React from 'react'
import Storage from '@unrest/storage'

import Board from '../tw/Board'

const storage = new Storage('saved_boards')
const cache = {}

const getBoard = (slug, { player, mode } = {}) => {
  const options = storage.get(slug)
  if (!options) {
    return undefined
  }
  if (!cache[slug] || cache[slug].options.player !== player) {
    options.player = player
    options.mode = mode
    cache[slug] = new Board(options)
  }
  return cache[slug]
}

export default (slug, player) => {
  const setState = React.useState()[1]
  const board = getBoard(slug, player)
  const update = () => setState(Math.random())
  const saveOptions = (formData) => {
    storage.set(slug, formData)
    update()
  }
  return {
    board,
    saveOptions,
    saveBoard: (board) => {
      const pieces = { 1: [], 2: [] }
      Object.values(board.entities.piece).forEach((piece) => {
        pieces[piece.team].push([piece.type, piece.index])
      })
      const walls = Object.fromEntries(
        // TODO X is magic string for out-generated exterior walls
        Object.entries(board.entities.wall).filter(([_, v]) => v !== 'X'),
      )
      const options = {
        W: board.W,
        H: board.H,
        pieces,
        walls,
      }
      saveOptions(options)
      board && board.connectPath()
      update()
    },
    step: () => {
      board.game.nextTurn()
      update()
    },
    restart: (slug) => {
      delete cache[slug]
      update()
    },
    update,
  }
}
