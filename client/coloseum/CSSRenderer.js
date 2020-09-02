import React from 'react'

import renderCSS from '../../tw/render/css'

const _click = (e, i) => console.log(i) // eslint-disable-line

export default function CSSRenderer({ board, onClick = _click, onMouseEnter, ...options }) {
  const DELAY = 200
  const { items, boardClass } = renderCSS(board, options)
  const board_id = 'board-' + board.id
  const click = (square) => (e) => onClick(e, square)
  const over = (square) => onMouseEnter && ((e) => onMouseEnter(e, square))
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
        <div className={i.className} key={i.id} id={i.id} onClick={click(i)} onMouseEnter={over(i)}>
          {i.children && i.children.map((c, ci) => <div className={c} key={ci} />)}
          {i.text !== undefined && <div className="text">{i.text}</div>}
        </div>
      ))}
    </div>
  )
}
