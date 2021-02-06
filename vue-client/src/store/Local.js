import ls from 'local-storage-json'
import { reactive } from 'vue'

export default ({ LS_KEY, initial, postUpdate = () => {}, init = () => {} }) => {
  const state = reactive(initial)
  const update = (data) => {
    Object.keys(state).forEach((key) => {
      if (data?.hasOwnProperty(key)) {
        state[key] = data[key]
      }
    })
    ls.set(LS_KEY, state)
    postUpdate(data)
  }

  update(ls.get(LS_KEY))

  const toggle = (key) => update({ [key]: !state[key] })

  return { update, state, toggle, init }
}