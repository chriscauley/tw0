import Local from '../Local'
import api from '@/api'

const LS_KEY = 'store/sprite/sheet'

const initial = {
  loading: false,
  list: [],
  byName: {},
}

const { state, update, toggle } = Local({ LS_KEY, initial })

function init() {
  api.get('/sprite-list.txt').then((r) => {
    r.split('\n')
      .filter(Boolean)
      .forEach((fname) => {
        const name = fname.replace(/\....$/, '')
        const sheet = state.byName[name] || { name, fname }
        const defaults = { size: 32, bg_color: null }
        Object.assign(sheet, defaults)
        if (!state.byName[name]) {
          state.list.push(sheet)
          state.byName[name] = sheet
        }
      })
    update()
  })
}

export default { state, update, init, toggle }
