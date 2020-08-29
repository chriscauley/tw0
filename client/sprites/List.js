import React from 'react'
import sprite from './sprite'

sprite('floorstairs')
sprite('floor0')
sprite('floor1')
sprite('floorlock')

export default function List() {
  return (
    <div className="SpriteList flex space-between">
      {sprite.list.map((slug) => (
        <div key={slug} className="p-2 border m-1">
          <div className={`sprite sprite-${slug}`} />
          {slug}
        </div>
      ))}
    </div>
  )
}
