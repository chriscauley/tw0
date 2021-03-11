import Local from './Local'
import { extra_getters } from 'tw/render/css'

const LS_KEY = 'store/game_settings'

const schema = {
  type: 'object',
  properties: {
    extra: {
      type: 'string',
      enum: Object.keys(extra_getters),
    },
    show_weapon: {
      title: 'Show Weapon',
      type: 'boolean',
    },
  },
}

const { state, update } = Local({ LS_KEY })

export default { schema, state, update }
