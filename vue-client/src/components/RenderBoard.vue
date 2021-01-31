<template>
  <div :class="boardClass">
    <div
      v-for="item in items"
      :class="item.className"
      :key="item.id"
      @click="click(item)"
      @mouseover="mouseover(item)"
    >
      <div v-for="c in item.children" :class="c" :key="c" />
      <div v-if="item.text" class="text">{{ item.text }}</div>
    </div>
  </div>
</template>

<script>
import renderCSS from 'tw/render/css'
export default {
  props: {
    board: Object,
    mouseover: {
      type: Function,
      default: () => {},
    },
    click: {
      type: Function,
      default: (item) => item.piece && console.log(item) // eslint-disable-line
    },
  },
  computed: {
    boardClass() {
      const { H, W } = this.board
      return `board W-${W} H-${H}`
    },
    items() {
      return renderCSS(this.board).items
    },
  },
}
</script>
