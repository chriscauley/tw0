<template>
  <div class="sprite-picker">
    <div class="canvas-wrapper" v-if="currentSheet">
      <canvas ref="canvas" @mousemove="mousemove" @click="click" />
      <div class="hovering" :style="css.box" />
      <div v-for="s in selectedIndexes" :key="s" class="selected" :style="css.selected(s)" />
    </div>
    <div class="actions">
      <links />
      <settings />
    </div>
    <div class="preview">
      <canvas ref="preview" :width="4 * currentSheet.scale" :height="4 * currentSheet.scale" />
    </div>
  </div>
</template>

<script>
import store from '@/store'
import Links from './Links'
import Settings from './Settings'
import FocusMixin from '@/FocusMixin'
import Geo from 'tw/Geo'

export default {
  components: { Links, Settings },
  mixins: [FocusMixin],
  data() {
    const { schema } = store.sprite.sheet
    return {
      hovering: null,
      selected: {},
      schema,
      geo: Geo(5, 5),
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
      const { scale } = this.currentSheet || {}
      const selected = (index) => {
        const [x, y] = this.geo.index2xy(index)
        return {
          left: `${x * scale}px`,
          top: `${y * scale}px`,
          height: `${scale}px`,
          width: `${scale}px`,
        }
      }
      return { selected, box: selected(this.hovering) }
    },
    selectedIndexes() {
      return Object.values(this.selected)
    },
  },
  watch: {
    currentSheet: 'redraw',
    'currentSheet.scale': 'redraw',
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
        const { scale } = this.currentSheet
        const canvas = document.createElement('canvas')
        canvas.width = scale
        canvas.height = scale
        this.drawTo(canvas)
        // window.open(canvas.toDataURL())
        const a = document.createElement('a')
        a.href = canvas.toDataURL()
        a.download = 'sprite.png'
        a.click()
        return
      }
      this.selected[this.hovering] = this.hovering
    },
    mousemove(event) {
      const { scale } = this.currentSheet
      const last_index = this.hovering
      this.hovering = this.geo.xy2index([
        Math.floor(event.offsetX / scale),
        Math.floor(event.offsetY / scale),
      ])
      if (last_index !== this.hovering) {
        this.drawTo(this.$refs.preview)
      }
      if (event.buttons === 1) {
        this.selected[this.hovering] = this.hovering
      }
    },
    drawTo(canvas) {
      const [x, y] = this.geo.index2xy(this.hovering)
      const img = store.sprite.sheet.getImage(this.$route.params.name)
      const { scale } = this.currentSheet
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingEnabled = false
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, x * scale, y * scale, scale, scale, 0, 0, canvas.width, canvas.height)
    },
    redraw() {
      const img = store.sprite.sheet.getImage(this.$route.params.name, this.redraw)
      if (!img) {
        return
      }
      const { width, height, scale } = this.currentSheet
      this.geo = Geo(Math.floor(width / scale), Math.floor(height / scale))
      const { canvas } = this.$refs
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
    },
  },
}
</script>
