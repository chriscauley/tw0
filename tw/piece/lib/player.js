// import after from '../move/after'
import { applyMove, applyDamage, canAttack, canMoveOn } from './index'

const getAttack = (player, dindex) => {
  const { weapon } = player.equipment
  const { dist, shape } = weapon
  const { index } = player
  let move = { index, dindex }
  if (weapon.step) {
    move = getStep(player, dindex)
    if (move.index === undefined) {
      return undefined
    }
  }

  const target_indexes = player.board.geo.look(shape, index, dist, dindex)
  const damages = target_indexes
    .filter((target_index) => canAttack(player, target_index))
    .map((target_index) => ({
      index: target_index,
      dindex,
      count: weapon.damage,
      source: player,
      sprite: weapon.name,
    }))
    .slice(0, weapon.splash)
  if (damages.length) {
    move.damages = damages
    return move
  }
}

const getStep = (player, dindex) => {
  const index = player.index + dindex
  const move = {
    index,
    done: true,
    dindex,
  }
  if (!canMoveOn(player.board, index)) {
    delete move.index
    move.push = { index, dindex }
  }
  return move
}

const getMove = (player, dindex) => {
  return getAttack(player, dindex) || getStep(player, dindex)
}

export const movePlayer = (player, { dindex, dindex2 }) => {
  if (dindex === 0) {
    // TODO swapItem, recharge, etc
    return [{}]
  }
  const move1 = getMove(player, dindex)
  applyMove(player, move1)
  move1.damages && move1.damages.forEach((d) => applyDamage(player.board, d))
  if (dindex2) {
    const move2 = getMove(player, dindex2)
    applyMove(player, move2)
    move2.damages && move2.damages.forEach((d) => applyDamage(player.board, d))
    return [move1, move2]
  }
  return [move1]
}

// const addMoves = moves => {
//   // add all moves together to make one big move
//   const dxys = moves.map(move => move.dxy).filter(dxy => dxy)
//   return {
//     dxy: vector.sum(dxys),
//     xy: _.reverse(moves).find(m => m.xy), // use last xy
//     damages: _.flatten(moves.map(m => m.damages).filter(Boolean)),
//   }
// }

// export const movePlayer = (player, { dxy, shiftKey, _ctrlKey, turn }) => {
//   if (vector.isZero(dxy)) {
//     const move = swapItem(player)
//     applyMove(player, move, turn)
//     return move
//   }
//   let move = getMove(player, dxy)

//   applyMove(player, move, turn)
//   if (shiftKey) {
//     const move2 = getMove(player, dxy)
//     applyMove(player, move2, turn)
//     if (move2.xy && move.xy && player.board.getOne('floor_dxy', move.xy)) {
//       // set tile of first move to dash direction
//       player.board.setOne('floor_dxy', move.xy, dxy)
//       move.flip_floor = dxy
//     }
//     move = addMoves([move, move2])
//   }
//   const gold = player.board.getOne('gold', player.xy)
//   if (gold) {
//     player.gold += gold
//     player.board.removeOne('gold', player.xy)
//     move.gold = gold
//   }
//   const ash = player.board.getOne('ash', player.xy)
//   if (ash) {
//     player.ash += ash
//     player.board.removeOne('ash', player.xy)
//     move.ash = ash
//   }
//   if (move.damages) {
//     move.damages.forEach(damage => {
//       if (damage.kill) {
//         player.kills++
//         player.kill_map[damage.kill.type] =
//           (player.kill_map[damage.kill.type] || 0) + 1
//       }
//     })
//   }
//   applyCombo(player, move)
//   return move
// }

// const applyCombo = (player, move) => {
//   const next_combo = player.combo + 2
//   let gained_combo = 0
//   move.damages && move.damages.length && gained_combo++
//   move.gold && gained_combo++
//   if (gained_combo) {
//     player.combo_parts += gained_combo
//     if (player.combo_parts >= next_combo) {
//       player.combo_parts = 0
//       player.combo++
//     }
//   } else {
//     if (player.combo_parts) {
//       player.combo_parts = 0
//     } else {
//       player.combo = Math.max(player.combo - 1, 0)
//     }
//   }
// }

// export const swapItem = player => {
//   const { board, equipment, xy } = player
//   const floor_item = board.getOne('item', xy)
//   const move = {
//     xy,
//     dxy: [0, 0],
//     done: !!floor_item,
//   }
//   if (floor_item) {
//     return after(move, () => {
//       const { slot } = floor_item
//       const old_item = equipment[slot]
//       player.equipment[slot] = floor_item
//       board.setOne('item', xy, old_item)
//     })
//   }
//   return move
// }
