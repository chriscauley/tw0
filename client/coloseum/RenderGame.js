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

// GlobalHotKeys.handlers seems to only be set once, so game needs to change outside of function definition
let game

export default function RenderGame({ controls = false, slug, player, mode }) {
  const { board, next, restart, update } = useBoard(slug, { mode, player })
  if (!board) {
    throw 404
  }
  game = board.game
  const { css, text, extra } = config.use().formData
  const handlers = {
    UNSELECT: () => alert('TODO unselect'),
    ARROW: (e) => game.pressArrow(e, update),
    SPACE: (e) => game.pressSpace(e, update),
    SHIFT_UP: (e) => game.up(e, update),
  }

  return (
    <div className="overflow-auto">
      <GlobalHotKeys handlers={handlers} keyMap={keyMap} />
      {controls && (
        <div>
          <button className={button('mr-2')} onClick={next}>
            next
          </button>
          <button className={button()} onClick={restart}>
            reset
          </button>
        </div>
      )}
      {css && <CSSRenderer board={board} extra={extra} restart={restart} />}
      {text && <TextRenderer board={board} extra_layers={[extra]} />}
      <config.Link />
    </div>
  )
}
