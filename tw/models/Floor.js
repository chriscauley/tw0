export default {
  sprites: {
    goal: 'o-pentagram',
  },
  tick(board) {
    Object.entries(board.entities.floor).forEach(([index, floor]) => {
      index = Number(index)
      const piece = board.getPiece(index)
      if (!piece) {
        return
      }
      if (floor.type === 'goal' && piece.type === 'ball') {
        board.removePiece(piece)
      }
    })
  },
}
