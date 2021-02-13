export default (piece, tasks_attr='tasks') => {
  let move = {}
  piece._type[tasks_attr].find((task) => {
    move = task(piece, move)
    return move && move.done
  })
  return move
}
