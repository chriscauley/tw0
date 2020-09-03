import React from 'react'
import Form from '@unrest/react-jsonschema-form'
import Storage from '@unrest/storage'

import Board from '../../tw/Board'
import CSSRenderer from './CSSRenderer'
import Reset from './Reset'
import tools from './tools'

const storage = new Storage('saved_boards')
const cache = {}

const getBoard = (slug) => {
  const options = storage.get(slug)
  if (!options) {
    return undefined
  }
  if (!cache[slug]) {
    cache[slug] = new Board(options)
  }
  return cache[slug]
}

const schema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    W: { type: 'integer', default: 9 },
    H: { type: 'integer', default: 9 },
  },
}

const useBoard = (slug) => {
  const setState = React.useState()[1]
  const update = () => setState(Math.random())
  return {
    board: getBoard(slug),
    save: (formData) => {
      storage.set(slug, formData)
      delete cache[slug]
      update()
    },
    update,
  }
}

export default function Editor({ match }) {
  const { slug } = match.params
  const { board, save, update } = useBoard(slug)
  const { toolClick } = tools.use()
  if (!board) {
    return <Form schema={schema} onSubmit={(formData) => save(formData)} />
  }
  const onClick = (e, s) => toolClick(e, board, s.index, update)
  const onMouseEnter = (e, s) => e.buttons === 1 && onClick(e, s)

  return (
    <div className="flex p-4">
      <div className="px-4">
        <tools.Form autosubmit={true} customButton={true} />
        <Reset reset={() => saveOptions(null)}/>
      </div>
      <CSSRenderer board={board} onClick={onClick} onMouseEnter={onMouseEnter} />
    </div>
  )
}
