<template>
  <div class="docs-css board">
    <div v-for="floor in floors" :key="floor" :class="floor" />
    <div v-for="piece in pieces" :key="piece[0]" :class="piece[0]">
      <div :class="piece[1]" />
    </div>
  </div>
</template>

<script>
import { range } from 'lodash'
import PieceType from 'tw/piece/types'

export default {
  __route: {
    path: '/docs/css',
  },
  data() {
    let SIZE = 5
    const pieces = []

    Object.values(PieceType.groups).forEach((group, ig) => {
      Object.values(group.pieces).forEach((piece, ip) => {
        pieces.push([`sprite piece x-${ip} y-${ig} dindex-d team-1`, `sprite sprite-${piece.slug}`])
        SIZE = Math.max(SIZE, ip + 1)
      })
    })

    const ROW = range(SIZE)
    const floors = []
    ROW.forEach((x) =>
      ROW.forEach((y) => floors.push(`sprite sprite-floor${(x + y) % 2} x-${x} y-${y}`)),
    )
    return { floors, pieces }
  },
}
</script>
