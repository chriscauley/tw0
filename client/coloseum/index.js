import React from 'react'
import css from '@unrest/css'

// import types from '../../tw/piece/types'
import render from '../../tw/render/text'
import { parsePieces } from '../../tw/Board'
import useBoard from '../useBoard'
import SearchHook from './SearchHook'

const schema = {
  type: 'object',
  properties: {
    W: { type: 'integer' },
    H: { type: 'integer' },
    pieces: { type: 'string' },
  },
}

const initial = {
  W: 9,
  H: 9,
  pieces: 'skull',
}

const { useSearch, SearchForm } = SearchHook({ initial, schema })

function Render({ options }) {
  const { game, next, reset } = useBoard(options)
  window.b = game.board

  return (
    <div>
      <pre>{render(game.board, { extra_layers: ['piece_dindex'] })}</pre>
      <button className={css.button('mr-2')} onClick={next}>
        next
      </button>
      <button className={css.button()} onClick={reset}>
        reset
      </button>
    </div>
  )
}

export default function Coloseum() {
  const { data } = useSearch()
  let Tag = Render
  try {
    parsePieces(data.pieces)
  } catch (e) {
    Tag = () => `Error: ${e}`
  }

  return (
    <div className="flex p-4">
      <div className="max-w-sm mr-4">
        <SearchForm />
      </div>
      <Tag options={data} />
    </div>
  )
}
