import Local from '../Local'

const LS_KEY = 'store/sprite/tag'

const initial = {
  list: [],
  selected: null,
}

const { state, update } = Local({ LS_KEY, initial })

const add = (tag) => {
  tag.id = state.list.length
  state.list.push(tag)
}

export default { state, update, all: () => state.list, add }
