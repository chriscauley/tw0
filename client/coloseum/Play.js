import React from 'react'

import RenderGame from './RenderGame'

export default function Play({ match }) {
  const { slug } = match.params
  return (
    <div className="flex p-4">
      <RenderGame slug={slug} player={1} mode="disco" />
    </div>
  )
}
