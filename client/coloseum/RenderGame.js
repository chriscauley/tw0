import React from 'react'
import { GlobalHotKeys } from 'react-hotkeys'
import css from '@unrest/css'

import renderText from '../../tw/render/text'
import renderCSS from '../../tw/render/css'
import useBoard from '../useBoard'

function TextRenderer({ board, ...options }) {
  const output = renderText(board, options)
  return <pre>{output}</pre>
}

function CSSRenderer({ board, ...options }) {
  const DELAY = 200
  const { items, boardClass } = renderCSS(board, options)
  const board_id = 'board-' + board.id
  const click = i => () => console.log(i) // eslint-disable-line
  const has_steps = items.filter((i) => i.steps)
  const stepTo = (no) => () => {
    has_steps.forEach((i) => {
      if (i.steps[no]) {
        document.getElementById(i.id).className = i.steps[no]
      }
    })
    if (has_steps.filter((i) => i.steps.length > no).length) {
      setTimeout(stepTo(no + 1), DELAY)
    }
  }
  setTimeout(stepTo(0), 0)
  return (
    <div className={boardClass} id={board_id}>
      {items.map((i) => (
        <div className={i.className} key={i.id} id={i.id} onClick={click(i)}>
          {i.children && i.children.map((c, ci) => <div className={c} key={ci} />)}
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

export default function RenderGame({ controls = false, css = false, text = false, options }) {
  const { game, next, reset, update } = useBoard(options)
  const handlers = {
    UNSELECT: () => alert('TODO unselect'),
    ARROW: (e) => game.pressArrow(e, update),
    SPACE: (e) => game.pressSpace(e, update),
    SHIFT_UP: game.up,
  }

  window.b = game.board

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
      {css && <renderers.css board={game.board} extra_layers={['piece_dindex']} />}
      {text && <renderers.text board={game.board} extra_layers={['piece_dindex']} />}
    </div>
  )
}
