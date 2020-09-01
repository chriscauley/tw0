import React from 'react'
import sprite from './sprite'

sprite('floorstairs')
sprite('floor0')
sprite('floor1')
sprite('floorlock')
sprite('wall0')
sprite('wall1')
sprite('wall2')
sprite('wall3')
sprite('wall4')
sprite('bat.awake')

export default function List() {
  return (
    <div className="SpriteList flex space-between flex-wrap">
      {sprite.list.map((slug) => (
        <div key={slug} className="p-2 border m-1">
          <div className={`sprite sprite-${slug}`} />
          {slug}
        </div>
      ))}
    </div>
  )
}
