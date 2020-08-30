import React from 'react'
import css from '@unrest/css'

// import types from '../../tw/piece/types'
import renderText from '../../tw/render/text'
import renderCSS from '../../tw/render/css'
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

function TextRenderer({ board, ...options }) {
  const output = renderText(board, options)
  return <pre>{output}</pre>
}

function CSSRenderer({ board, ...options }) {
  const { items, boardClass } = renderCSS(board, options)
  return (
    <div className={boardClass}>
      {items.map((i) => (
        <div className={i.className} key={i.id}>
          {i.children && i.children.map((c) => <div className={c} key={c} />)}
        </div>
      ))}
    </div>
  )
}

const renderers = {
  text: TextRenderer,
  css: CSSRenderer,
}

function Render({ options }) {
  // const Renderer = renderers.css
  const { game, next, reset } = useBoard(options)
  window.b = game.board

  return (
    <div className="overflow-auto">
      <renderers.css board={game.board} extra_layers={['piece_dindex']} />
      <renderers.text board={game.board} extra_layers={['piece_dindex']} />
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
