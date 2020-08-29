import React from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import Form from '@unrest/react-jsonschema-form'
import qs from 'query-string'

import { SHAPES } from '../../tw/Geo'
import Board from '../../tw/Board'
import render from '../../tw/render/text'

const SIZE = 11

const schema = {
  type: 'object',
  required: ['shape','dist', 'dindex'],
  properties: {
    shape: {
      type: 'string',
      enum: SHAPES,
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
  shape: SHAPES[0],
  dist: 2,
  dir: 'r',
}

const useLook = () => {
  const { search } = useLocation()
  const data = {
    ...initial,
    ...qs.parse(search.replace(/^\?/,''))
  }
  data.dist = parseInt(data.dist)
  return data
}

function RouterForm({schema}) {
  const formData = useLook()
  const history = useHistory()
  const onChange = (formData) => history.push('?'+qs.stringify(formData))
  return (
    <Form
      formData={formData}
      onChange={onChange}
      autoSubmit={true}
      customButton={true}
      schema={schema}
    />
  )
}

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
  const { shape, dist, dir } = useLook()
  const highlight = board.geo.look(shape, board.geo.CENTER, dist, board.geo._name2dindex[dir])
  return (
    <div className="flex p-4">
      <div className="mr-4" style={{width: '16rem'}}>
        <RouterForm schema={schema} />
      </div>
      <Render board={board} empty=" " path={false} highlight={highlight}/>
    </div>
  )
}