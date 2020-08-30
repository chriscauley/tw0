import React from 'react'

// import types from '../../tw/piece/types'
import RenderGame from './RenderGame'
import { parsePieces } from '../../tw/Board'
import SearchHook from './SearchHook'

const schema = {
  type: 'object',
  properties: {
    W: { type: 'integer' },
    H: { type: 'integer' },
    pieces: { type: 'string' },
  },
}

const initial = {
  W: 9,
  H: 9,
  pieces: 'skull',
}

const { useSearch, SearchForm } = SearchHook({ initial, schema })

export default function Coloseum() {
  const { data } = useSearch()
  let Tag = RenderGame
  try {
    parsePieces(data.pieces)
  } catch (e) {
    Tag = () => `Error: ${e}`
  }

  return (
    <div className="flex p-4">
      <div className="max-w-sm mr-4">
        <SearchForm />
      </div>
      <Tag options={data} css text controls />
    </div>
  )
}
