<template>
  <div class="flex flex-wrap inset-0 absolute">
    <div class="relative w-full overflow-auto" v-if="currentSheet" @click="click">
      <canvas ref="canvas" @mousemove="move" />
      <div class="absolute border-2 border-green-300" :style="css.box" />
      <div
        v-for="s in selected"
        :key="s"
        class="border-red-500 border-2 absolute"
        :style="css.selected(s)"
      />
    </div>
    <div>
      <router-link
        class="mr-2"
        v-for="sheet in sheets"
        :key="sheet.name"
        :to="`/sprite-picker/${sheet.name}/`"
      >
        {{ sheet.name }}
      </router-link>
    </div>
  </div>
</template>

<script>
import store from '@/store'

export default {
  data() {
    return {
      mouse: [],
      hovering: [],
      selected: [],
    }
  },
  __route: {
    path: '/sprite-picker/:name?',
  },
  computed: {
    sheets: () => store.sprite.sheet.state.list,
    currentSheet() {
      return store.sprite.sheet.state.byName[this.$route.params.name]
    },
    css() {
      const { x_scale, y_scale } = this.currentSheet || {}
      return {
        box: {
          left: `${this.hovering[0] * x_scale}px`,
          top: `${this.hovering[1] * y_scale}px`,
          height: `${y_scale}px`,
          width: `${x_scale}px`,
        },
        selected: ([x, y]) => ({
          left: `${x * x_scale}px`,
          top: `${y * y_scale}px`,
          height: `${y_scale}px`,
          width: `${x_scale}px`,
        }),
      }
    },
  },
  watch: {
    currentSheet: 'redraw',
  },
  mounted() {
    this.redraw()
  },
  methods: {
    click() {
      this.selected.push(this.hovering)
    },
    move(event) {
      const { x_scale, y_scale } = this.currentSheet
      this.mouse = [event.offsetX, event.offsetY]
      this.hovering = [Math.floor(event.offsetX / x_scale), Math.floor(event.offsetY / y_scale)]
    },
    redraw() {
      const img = store.sprite.sheet.getImage(this.$route.params.name, this.redraw)
      if (!img) {
        return
      }
      const { width, height } = this.currentSheet
      const { canvas } = this.$refs
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
    },
  },
}
</script>
