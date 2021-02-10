export default (piece, move) => ({
  ...move,
  dindex: -(move.dindex || piece.dindex),
  done: true,
})
