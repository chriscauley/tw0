import sprite from './sprite'
import { format } from 'date-fns'

const store = { sprite }

const list = []
Object.entries(store).forEach(([_name, module]) => {
  list.push(module)
})

store.list = list
store.init = () => {
  store.list.forEach((m) => m.init(m))
}

// TODO should by dynamic from LS_KEY in each module
const SLUGS = ['sprite/sheet', 'sprite/tag']

export const exportJson = () => {
  const out = {}
  SLUGS.forEach((slug) => {
    const LS_KEY = 'store/' + slug
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
