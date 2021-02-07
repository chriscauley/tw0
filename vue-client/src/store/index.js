import sprite from './sprite'

const store = { sprite }

const list = []
Object.entries(store).forEach(([_name, module]) => {
  list.push(module)
})

store.list = list
store.init = () => {
  store.list.forEach((m) => m.init(m))
}

window.exportJson = () => {
  ;['sprite/sheet', 'sprite/tag'].forEach((slug) => {
    const LS_KEY = 'store/' + slug
    const fname = slug.replace(/\//g, '__') + '.json'
    const a = document.createElement('a')
    const text = window.localStorage.getItem(LS_KEY)
    a.href = window.URL.createObjectURL(new window.Blob([text], { type: 'file text' }))
    a.download = fname
    a.click()
  })
}

export default store
