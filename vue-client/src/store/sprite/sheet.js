import { reactive } from 'vue'

import Local from '../Local'
import api from '@/api'

const LS_KEY = 'store/sprite/sheet'

const { state: byName, update } = Local({ LS_KEY, initial: {} })

// localStorage.clear()

const state = reactive({
  byName,
  loading: false,
  img_cache: {},
  cached: 0,
})

const all = () => Object.values(state.byName)

const loading = {}

function init() {
  api.get('/sprite-list.txt').then((r) => {
    r.split('\n')
      .filter(Boolean)
      .forEach((fname) => {
        const name = fname.replace(/\....$/, '')
        const defaults = {
          name,
          fname,
          scale: 32,
          zoom: 1,
          bg_color: null,
        }
        const sheet = state.byName[name] || defaults
        sheet.url = `/static/sprites/source/${fname}`
        sheet.cached = false
        if (!state.byName[name]) {
          state.byName[name] = sheet
        }
      })
    update()
  })
}

const getImage = (name, callback) => {
  const sheet = state.byName[name]
  if (sheet && !state.img_cache[name] && !loading[name]) {
    loading[name] = true
    const img = document.createElement('img')
    sheet.cached = true
    img.src = sheet.url
    img.onload = () => {
      sheet.width = img.width
      sheet.height = img.height
      update()
      state.img_cache[name] = img
      state.cached++
      callback()
    }
  }
  return state.img_cache[name]
}

const schema = {
  type: 'object',
  properties: {
    scale: { type: 'number', default: 32 },
    bg_color: { type: 'string', format: 'color' },
    zoom: { type: 'number', default: 1 },
  },
}

export default { state, update, init, getImage, schema, all }
