import React from 'react'
import objectHash from 'object-hash'

import Board from '../tw/Board'
import Game from '../tw/Game'

const board_cache = {}
const getGame = (options) => {
  const hash = objectHash(options).slice(0, 8)
  if (!board_cache[hash]) {
    const board = new Board(options)
    board_cache[hash] = new Game({ board, id: hash })
  }
  return board_cache[hash]
}

export default (options) => {
  const [_, setState] = React.useState()
  const game = getGame(options)
  const update = () => setState(Math.random())
  const reset = () => {
    delete board_cache[game.id]
    update()
  }
  const next = () => {
    game.nextTurn()
    update()
  }

  return { game, next, reset }
}
