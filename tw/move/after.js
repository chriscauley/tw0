// Creates a queue of functions to be executed when the move is completed
// Adds that function to the queue

const after = (move, f) => {
  if (!move.after) {
    move.after = []
  }
  move.after.push(f)
  return move
}

after.done = (move, f) => {
  move.done = true
  return after(move, f)
}

export default after
