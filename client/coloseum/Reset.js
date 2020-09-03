import React from 'react'
import { useSelect } from '@unrest/core'
import css from '@unrest/css'

export default function Reset({ reset }) {
  const { open, toggle, childRef } = useSelect()
  if (open) {
    return (
      <div className={css.modal.outer()}>
        <div className={css.modal.mask()} />
        <div className={css.modal.content()} ref={childRef}>
          <div>This cannot be undone. Are you sure?</div>
          <div className="flex justify-between">
            <button className={css.button.light()} onClick={toggle}>
              No
            </button>
            <button className={css.button.danger()} onClick={reset}>
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    )
  }
  return (
    <button className={css.button.danger()} onClick={toggle}>
      Delete
    </button>
  )
}
