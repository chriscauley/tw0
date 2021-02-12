import sheet from './sheet'
import tag from './tag'
import { format } from 'date-fns'

const store = {}

const list = (store.list = [])
const LS_KEYS = []
Object.entries({ sheet, tag }).forEach(([name, module]) => {
  list.push(module)
  store[name] = module
  LS_KEYS.push(module.LS_KEY)
})

store.init = () => {
  store.list.forEach((m) => m.init?.(m))
}

export const exportJson = () => {
  const out = {}
  LS_KEYS.forEach((LS_KEY) => {
    out[LS_KEY] = window.localStorage.getItem(LS_KEY)
  })
  const a = document.createElement('a')
  a.href = window.URL.createObjectURL(new window.Blob([JSON.stringify(out)], { type: 'file text' }))
  const date = format(new Date(), 'yyyyMMdd-HHmmss')
  a.download = `twexport__${date}.json`
  a.click()
}

export const importJson = (text) => {
  localStorage.clear()
  const data = JSON.parse(text)
  Object.entries(data).forEach(([key, value]) => {
    localStorage.setItem(key, value)
  })
  window.location.reload()
}

export default store
