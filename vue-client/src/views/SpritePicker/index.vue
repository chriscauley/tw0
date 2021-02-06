<template>
  <div class="sprite-picker">
    <div class="canvas-wrapper" v-if="currentSheet" @click="click">
      <canvas ref="canvas" @mousemove="mousemove" />
      <div class="absolute border-2 border-green-300 pointer-events-none" :style="css.box" />
      <div
        v-for="s in selected"
        :key="s"
        class="border-red-500 border-2 absolute"
        :style="css.selected(s)"
      />
    </div>
    <div class="actions">
      <links />
      <settings />
    </div>
    <div class="preview">
      <canvas ref="preview" :width="4 * currentSheet.x_scale" :height="4 * currentSheet.y_scale" />
    </div>
  </div>
</template>

<script>
import store from '@/store'
import Links from './Links'
import Settings from './Settings'
import FocusMixin from '@/FocusMixin'

export default {
  components: { Links, Settings },
  mixins: [FocusMixin],
  data() {
    const { schema } = store.sprite.sheet
    return {
      mouse: [],
      hovering: [],
      selected: [],
      schema,
    }
  },
  __route: {
    path: '/sprite-picker/:name?',
  },
  computed: {
    sheets: store.sprite.sheet.all,
    currentSheet() {
      return store.sprite.sheet.state.byName[this.$route.params.name]
    },
    css() {
      const { x_scale, y_scale, resolution } = this.currentSheet || {}
      return {
        box: {
          left: `${this.hovering[0] * resolution}px`,
          top: `${this.hovering[1] * resolution}px`,
          height: `${y_scale}px`,
          width: `${x_scale}px`,
        },
        selected: ([x, y]) => ({
          left: `${x * resolution}px`,
          top: `${y * resolution}px`,
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
    saveState() {
      store.sprite.sheet.update()
    },
    click(event) {
      if (event.shiftKey) {
        const { x_scale, y_scale } = this.currentSheet
        const canvas = document.createElement('canvas')
        canvas.width = x_scale
        canvas.height = y_scale
        this.drawTo(canvas)
        // window.open(canvas.toDataURL())
        const a = document.createElement('a')
        a.href = canvas.toDataURL()
        a.download = 'sprite.png'
        a.click()
        return
      }
      this.selected.push(this.hovering)
    },
    drawTo(canvas) {
      const img = store.sprite.sheet.getImage(this.$route.params.name)
      const { x_scale, y_scale, resolution } = this.currentSheet
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingEnabled = false
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(
        img,
        this.hovering[0] * resolution,
        this.hovering[1] * resolution,
        x_scale,
        y_scale,
        0,
        0,
        canvas.width,
        canvas.height,
      )
    },
    mousemove(event) {
      const { resolution } = this.currentSheet
      this.mouse = [event.offsetX, event.offsetY]
      const [last_x, last_y] = this.hovering
      this.hovering = [
        Math.floor(event.offsetX / resolution),
        Math.floor(event.offsetY / resolution),
      ]
      if (last_x !== this.hovering[0] || last_y !== this.hovering[1]) {
        this.drawTo(this.$refs.preview)
      }
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
