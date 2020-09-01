import React from 'react'

import renderCSS from '../../tw/render/css'

export default function CSSRenderer({ board, ...options }) {
  const DELAY = 200
  const { items, boardClass } = renderCSS(board, options)
  const board_id = 'board-' + board.id
  const click = i => () => console.log(i) // eslint-disable-line
  const has_steps = items.filter((i) => i.steps)
  const layer_class = options.extra_layers.map((l) => `layer-${l}`).join(' ')
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
    <div className={boardClass + ' ' + layer_class} id={board_id}>
      {items.map((i) => (
        <div className={i.className} key={i.id} id={i.id} onClick={click(i)}>
          {i.children && i.children.map((c, ci) => <div className={c} key={ci} />)}
        </div>
      ))}
    </div>
  )
}
