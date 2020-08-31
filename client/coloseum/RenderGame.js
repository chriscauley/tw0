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
  const { items, boardClass } = renderCSS(board, options)
  const board_id = 'board-' + board.id
  const click = i => () => console.log(i) // eslint-disable-line
  const stepTo = (no) => () => {
    const s = 'step' + no
    items.filter((i) => i[s]).forEach((i) => (document.getElementById(i.id).className = i[s]))
    if (no < 3) {
      setTimeout(stepTo(no + 1), 200)
    }
  }
  setTimeout(stepTo(1), 0)
  return (
    <div className={boardClass} id={board_id}>
      {items.map((i) => (
        <div className={i.className} key={i.id} id={i.id} onClick={click(i)}>
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
