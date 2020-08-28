import React from 'react'
// import ConfigHook from '@unrest/react-config-hook'

import types from '../../tw/piece/types'
import render from '../../tw/render/text'
import useBoard from '../useBoard'

// const { useConfig } = ConfigHook('coloseum', schema, uiSchema)


export default function Coloseum () {
  const { game, next, reset } = useBoard({W: 8, H: 3, path: [9, 14], pieces: 'skull'})

  return (
    <div>
      <pre >{render(game.board)}</pre>
      <button onClick={next}>next</button>
      <button onClick={reset}>reset</button>
    </div>
  )
}