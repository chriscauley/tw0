import after from 'tw/move/after'
import { applyMove, applyDamage, canAttack, canMoveOn } from './index'
import Item from 'tw/models/Item'

const getAttack = (player, dindex) => {
  const { weapon } = player.equipment
  const { hitbox, splash, step, sprite } = weapon._type
  const { index } = player
  let move = { index, dindex }
  if (step) {
    move = getStep(player, dindex)
    if (move.index === undefined) {
      return undefined
    }
  }
  const can_hit = player.board.geo.look(hitbox.shape, index, hitbox.dist, dindex)
        .find((target_index) => canAttack(player, target_index))

  if (can_hit !== undefined) {
    const target_indexes = player.board.geo.look(splash.shape, index, splash.dist, dindex)
    const damages = target_indexes
          .map((target_index) => ({
            index: target_index,
            dindex,
            source: player,
            sprite,
          }))
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

export const movePlayer = (player, { dindex }) => {
  if (dindex === 0) {
    applyMove(player, swapItem(player, { dindex }))
    return
  }
  const move = getMove(player, dindex)
  const score = {
    _turn: player.board.game.turn,
  }
  if (score._turn === player.scores[player.scores.length - 1]?._turn) {
    score.sprint = 1
  }
  if (move.index !== player.index) {
    score.step = 1
  }
  applyMove(player, move)
  move.damages?.forEach((d) => {
    applyDamage(player.board, d)
    if (d.kill) {
      score[d.kill.type] = 1
      score.kill = 1
    }
    score[d.type] = (score[d.type] || 0) + 1
  })
  player.scores.push(score)
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

const swapItem = (player, move) => {
  const { board, equipment, index } = player
  const floor_item = board.getOne('item', index)
  if (floor_item) {
    return after(move, () => {
      const { slot } = Item[floor_item.type]
      const old_item = equipment[slot]
      player.equipment[slot] = floor_item
      board.setOne('item', index, old_item)
    })
  }
  return move
}
