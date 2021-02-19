import vector from 'tw/Geo/vector'

export default (action) => (piece, move) => {
  const targets = piece.board
        .getMany('piece', piece.board.geo.look('box', piece.index, piece.sight, 1))
        .filter(p => p.team !== piece.team && p.player)
  if (!targets.length) {
    return move
  }
  const target = targets[0] // TODO sort by distance
  const geo = piece.board.geo
  const dindex = move.dindex || piece.dindex
  const xy1 = geo.index2xy(piece.index)
  const xy2 = geo.index2xy(target.index)
  const delta_dxy = vector.subtract(xy1, xy2)
  const target_dxy = geo.dindex2dxy(target.dindex)
  if (delta_dxy[0] && Math.sign(delta_dxy[0]) === Math.sign(target_dxy[0])) {
    return action(piece, move)
  }
  if (delta_dxy[1] && Math.sign(delta_dxy[1]) === Math.sign(target_dxy[1])) {
    return action(piece, move)
  }
  return move
}
