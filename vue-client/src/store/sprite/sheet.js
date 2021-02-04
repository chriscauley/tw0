import { reactive } from 'vue'

import Local from '../Local'
import api from '@/api'

const LS_KEY = 'store/sprite/sheet'

const { state: byName, update } = Local({ LS_KEY, initial: {} })

// localStorage.clear()

const state = reactive({
  byName,
  loading: false,
  list: [],
  img_cache: {},
  cached: 0,
})

const loading = {}

function init() {
  api.get('/sprite-list.txt').then((r) => {
    r.split('\n')
      .filter(Boolean)
      .forEach((fname) => {
        const name = fname.replace(/\....$/, '')
        const sheet = state.byName[name] || { name, fname }
        sheet.url = `/static/sprites/source/${fname}`
        sheet.cached = false
        const defaults = { x_scale: 32, y_scale: 32, bg_color: null }
        Object.assign(sheet, defaults)
        if (!state.byName[name]) {
          state.list.push(sheet)
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

export default { state, update, init, getImage }
