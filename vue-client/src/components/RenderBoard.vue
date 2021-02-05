<template>
  <div>{{ board.game.turn }}</div>
  <div :class="boardClass">
    <div
      v-for="item in items"
      :class="item.className"
      :key="item.id"
      @click="click(item)"
      @mouseover="mouseover(item)"
    >
      <div v-for="c in item.children" :class="c" :key="c" />
      <div v-if="item.text !== undefined" class="text">{{ item.text }}</div>
    </div>
  </div>
</template>

<script>
import renderCSS from 'tw/render/css'
const ANIMATION_TIME = 300

export default {
  props: {
    board: Object,
    hash: String,
    mouseover: {
      type: Function,
      default: () => {},
    },
    click: {
      type: Function,
      default: (item) => item.piece && console.log(item) // eslint-disable-line
    },
  },
  data() {
    return { items: [], boardClass: '' }
  },
  watch: {
    hash: 'sync',
  },
  mounted() {
    this.sync()
  },
  methods: {
    sync() {
      const { H, W } = this.board
      this.items = renderCSS(this.board).items
      this.boardClass = `board W-${W} H-${H} turn-${this.board.game.turn}`
      setTimeout(this.step, 100)
    },
    step() {
      let needs_step
      this.items.forEach((item) => {
        if (item.steps?.length) {
          needs_step = true
          item._done = item._done || []
          item._done.push(item.className)
          item.className = item.steps.shift()
        }
      })
      needs_step && setTimeout(this.step, ANIMATION_TIME)
    },
  },
}
</script>
