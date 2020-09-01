import React from 'react'

import RenderGame from './RenderGame'

const getOptions = (pieces) => {
  const piece_sets = {
    bones: '|skeleton',
    bats: '|bat',
  }
  return {
    W: 9,
    H: 9,
    player: 1,
    pieces: piece_sets[pieces],
  }
}

export default function Play({ match }) {
  const { pieces } = match.params
  return (
    <div className="flex p-4">
      <RenderGame options={getOptions(pieces)} css />
    </div>
  )
}
