import React from 'react'
import { GlobalHotKeys } from 'react-hotkeys'
import css from '@unrest/css'

import renderText from '../../tw/render/text'
import useBoard from '../useBoard'
import CSSRenderer from './CSSRenderer'
import config from './config'

function TextRenderer({ board, ...options }) {
  const output = renderText(board, options)
  return <pre>{output}</pre>
}

const renderers = {
  text: TextRenderer,
  css: CSSRenderer,
}

const { button } = css
const ARROWS = ['up', 'down', 'left', 'right']

// TODO The page scrolls if you hold down an arrow or space. I'll use a css workround for now
const keyMap = {
  UNSELECT: 'escape',
  ARROW: ARROWS,
  SPACE: ['space', 'shift+space'],
  SHIFT_UP: {
    sequence: 'shift',
    action: 'keyup',
  },
}

export default function RenderGame({ controls = false, slug, player, mode }) {
  const { board, next, reset, update } = useBoard(slug, { mode, player })
  if (!board) {
    throw 404
  }
  const { game } = board
  const { css, text, extra } = config.use().formData
  const handlers = {
    UNSELECT: () => alert('TODO unselect'),
    ARROW: (e) => game.pressArrow(e, update),
    SPACE: (e) => game.pressSpace(e, update),
    SHIFT_UP: game.up,
  }

  return (
    <div className="overflow-auto">
      <GlobalHotKeys handlers={handlers} keyMap={keyMap} />
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
      {css && <renderers.css board={board} extra={extra} />}
      {text && <renderers.text board={board} extra_layers={[extra]} />}
      <config.Link />
    </div>
  )
}
