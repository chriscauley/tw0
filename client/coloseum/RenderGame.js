import React from 'react'
import css from '@unrest/css'

import renderText from '../../tw/render/text'
import renderCSS from '../../tw/render/css'
import useBoard from '../useBoard'

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

const { button } = css

export default function RenderGame({ controls = false, css = false, text = false, options }) {
  const { game, next, reset } = useBoard(options)
  window.b = game.board

  return (
    <div className="overflow-auto">
      {controls && (
        <div>
          <button className={button('mr-2')} onClick={next}>
            next
          </button>
          <button className={button()} onClick={reset}>
            reset
          </button>
        </div>
      )}
      {css && <renderers.css board={game.board} extra_layers={['piece_dindex']} />}
      {text && <renderers.text board={game.board} extra_layers={['piece_dindex']} />}
    </div>
  )
}
