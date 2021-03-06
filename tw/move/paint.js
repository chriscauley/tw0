import { flatten } from 'lodash'

//#! TODO currently not used
const oneAction = (func) => (action) => {
  const wrapped = func(action)
  wrapped.paint = action.paint
  return wrapped
}

const manyActions = (func) => (actions) => {
  const wrapped = func(actions)
  const paints = actions.map((a) => a.paint).filter(Boolean)
  if (paints.length === 1) {
    wrapped.paint = paints[0]
  } else if (paints.length) {
    //#! TODO currently not used
    wrapped.paint = (piece) => flatten(paints.map((p) => p(piece)))
  }
  return wrapped
}

const spriteXYs = (getXYs, sprite) => (piece, move, dxy) => {
  const xys = getXYs(piece, move, dxy) || []
  return xys.map((xy) => ({ sprite, xy }))
}

const paintTasks = (tasks, piece) => {
  return flatten(
    tasks
      .map((t) => t.paint)
      .filter(Boolean)
      .map((p) => p(piece)),
  )
}

export default {
  oneAction,
  manyActions,
  spriteXYs,
  paintTasks,
}
