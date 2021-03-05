<template>
  <div :class="boardClass">
    <div
      v-for="item in items"
      :class="item.className"
      :key="item.id"
      @click="click(item)"
      @mouseover="mouseover(item)"
    >
      <div v-for="(c, i) in item.children" :class="c" :key="i" />
      <div v-if="item.text !== undefined" class="text">{{ item.text }}</div>
    </div>
    <div v-for="(item, i) in uiItems" v-bind="item" :key="i" />
    <player-score v-if="board.player" :board="board" :hash="hash" />
  </div>
</template>

<script>
import renderCSS, { renderUI } from 'tw/render/css'
import settings from '@/store/settings'
import PlayerScore from './PlayerScore'

const ANIMATION_TIME = 300

export default {
  components: { PlayerScore },
  props: {
    board: Object,
    hash: String,
    queue: Array,
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
    return { items: [], boardClass: '', timeout: null }
  },
  computed: {
    extra: () => settings.state.extra,
    uiItems() {
      return renderUI(this)
    },
  },
  watch: {
    hash: 'sync',
    extra: 'sync',
  },
  mounted() {
    this.sync()
  },
  methods: {
    sync() {
      const { H, W } = this.board
      this.items = renderCSS(this.board, { extra: this.extra }).items
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
      if (needs_step) {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(this.step, ANIMATION_TIME)
      }
    },
  },
}
</script>
