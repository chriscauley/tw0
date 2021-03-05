<template>
  <div v-if="board.player" class="player-score">
    <div v-for="score in scores" :key="score.type" class="score" :data-value="score.value">
      <div :class="score.css" />
    </div>
  </div>
</template>

<script>
import piece_types from 'tw/piece/types'

export default {
  props: {
    board: Object,
    hash: String,
  },
  data() {
    // currently only showing pieces killed
    const visible_types = {}
    piece_types.slugs.forEach((t) => (visible_types[t] = true))
    return { scores: [], visible_types }
  },
  watch: {
    hash: 'sync',
  },
  mounted() {
    this.sync()
  },
  methods: {
    sync() {
      const hist = {}
      this.board.player.scores.forEach((score) => {
        Object.entries(score).forEach(([type, value]) => {
          if (this.visible_types[type]) {
            hist[type] = (hist[type] || 0) + value
          }
        })
      })
      this.scores = Object.entries(hist).map(([type, value]) => ({
        value,
        type,
        css: `sprite sprite-${type}`,
      }))
    },
  },
}
</script>
