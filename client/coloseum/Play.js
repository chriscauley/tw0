import React from 'react'

import RenderGame from './RenderGame'

const options = {
  W: 9,
  H: 9,
  player: 1,
  pieces: '|5xskull',
}

export default function Play() {
  return (
    <div className="flex p-4">
      <RenderGame options={options} css text controls />
    </div>
  )
}
