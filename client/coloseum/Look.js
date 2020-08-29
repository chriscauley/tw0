import React from 'react'

import SearchHook from './SearchHook'
import Shapes from '../../tw/Geo/Shapes'
import Board from '../../tw/Board'
import render from '../../tw/render/text'

const SIZE = 11

const schema = {
  type: 'object',
  required: ['shape','dist', 'dindex'],
  properties: {
    shape: {
      type: 'string',
      enum: Shapes.list,
    },
    dist: {
      type: 'integer',
      enum: [1,2,3,4],
    },
    dir: {
      type: 'integer',
      enum: ['u', 'l', 'r', 'd'],
    }
  }
}

const initial = {
  shape: Shapes.list[0],
  dist: 2,
  dir: 'r',
}

const {useSearch, SearchForm } = SearchHook({initial, schema})

const Render = ({board, ...props}) => {
  const text = render(board, props)
  const rows = text.split('\n').map(s => s.split(''))
  return (
    <div>
    {rows.map((cols, i) => (
      <div key={i} className="flex">
        {cols.map((char, i) => (
          <div key={i} className="w-4 h-4 flex items-center justify-center">{char}</div>
        ))}
      </div>
    ))}
    </div>
  )
}

export default function Look({match}) {
  const board = new Board({W: SIZE, H: SIZE})
  window.b = board
  const center = board.geo.center
  const { shape, dist, dir } = useSearch().data
  const highlight = board.geo.look(shape, board.geo.CENTER, parseInt(dist), board.geo._name2dindex[dir])
  return (
    <div className="flex p-4">
      <div className="mr-4" style={{width: '16rem'}}>
        <SearchForm />
      </div>
      <Render board={board} empty=" " path={false} highlight={highlight}/>
    </div>
  )
}