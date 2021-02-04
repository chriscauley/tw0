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

export default store
