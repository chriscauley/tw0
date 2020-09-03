import ConfigHook from '@unrest/react-config-hook'

import types from '../../tw/piece/types'

const schema = {
  type: 'object',
  properties: {
    layer: {
      type: 'string',
      enum: ['wall', 'piece', 'node'],
    },
    team: {
      type: 'integer',
      enum: [1, 2],
    },
    piece_type: {
      type: 'string',
      enum: types.slugs,
    },
  },
}

const uiSchema = {
  team: {
    'ui:widget': 'radio',
  },
  layer: {
    'ui:widget': 'radio',
  },
}

const initial = {
  formData: {
    team: 1,
    layer: 'wall',
  },
}

const { useConfig, Form } = ConfigHook('editor-tools', { schema, uiSchema, initial })

const add = {
  wall: (b, i, c) => {
    b.entities.square[i] = true
    delete b.entities.piece[i]
    delete b.entities.path[i]
    b.entities.wall[i] = c.wall
  },
  square: (b, i) => {
    b.endedies.square[i] = true
  },
  piece: (b, i, c) => {
    if (!b.entities.wall[i]) {
      const { piece_type, team } = c
      b.newPiece({
        type: piece_type,
        index: i,
        team,
      })
    }
  },
  node: (b, i) => {
    b.options.nodes = b.options.nodes.filter((i2) => i2 !== i)
    b.options.nodes.push(i)
  },
}

const remove = {
  wall: (b, i) => delete b.entities.wall[i],
  square: (b, i) => {
    delete b.entities.piece[i]
    delete b.entities.path[i]
    delete b.entities.square[i]
    delete b.entities.wall[i]
  },
  piece: (b, i) => delete b.entities.piece[i],
  node: (b, i) => (b.options.nodes = b.options.nodes.filter((i2) => i2 !== i)),
}

const click = (event, board, index, config, save) => {
  const { layer } = config
  config.wall = 1
  const value = board.entities[layer][index]
  if (event.shiftKey) {
    if (value !== undefined) {
      remove[layer](board, index)
      save(board)
    }
  } else {
    if (value === undefined) {
      add[layer](board, index, config)
      save(board)
    }
  }
}
export default {
  Form,
  use: () => {
    const { formData } = useConfig()
    return {
      formData,
      toolClick: (event, board, index, save) => click(event, board, index, formData, save),
    }
  },
}
