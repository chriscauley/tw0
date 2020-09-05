import React from 'react'
import css from '@unrest/css'

export default function GameOver({ board, restart }) {
  if (!board.player || board.player.health > 0) {
    return null
  }
  return (
    <div className={css.modal.outer()}>
      <div className={css.modal.mask()} />
      <div className={css.modal.content()}>
        <h2>{Math.random() < 0.1 ? 'Womp womp' : 'Game over'}</h2>
        <button className={css.button.success()} onClick={restart}>
          Restart
        </button>
      </div>
    </div>
  )
}
