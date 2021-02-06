<template>
  <div class="sprite-picker">
    <div class="canvas-wrapper" v-if="currentSheet">
      <canvas ref="canvas" @mousemove="mousemove" @click="click" />
      <div class="hovering" :style="css.hovering" />
      <div v-if="selected !== undefined" class="selected" :style="css.selected" />
      <div v-for="i in namedIndexes" :key="i" class="named" :style="css.box(i)" />
    </div>
    <div class="actions">
      <tags />
      <links />
      <settings />
    </div>
    <div class="preview">
      <canvas ref="preview" :width="4 * outSize" :height="4 * outSize" />
      <input
        v-if="selected !== undefined"
        :style="`width: ${4 * outSize}px`"
        class="form-control text-black"
        v-model="currentSheet.sprites[selected]"
        @input="rename"
      />
    </div>
  </div>
</template>

<script>
import store from '@/store'
import Links from './Links'
import Settings from './Settings'
import Tags from './Tags'
import FocusMixin from '@/FocusMixin'
import Geo from 'tw/Geo'

export default {
  components: { Links, Settings, Tags },
  mixins: [FocusMixin],
  data() {
    const { schema } = store.sprite.sheet
    return {
      hovering: null,
      selected: undefined,
      schema,
      geo: Geo(5, 5),
    }
  },
  __route: {
    path: '/sprite-picker/:name?',
  },
  computed: {
    namedIndexes() {
      return Object.keys(this.currentSheet.sprites).map(Number)
    },
    outSize() {
      return this.currentSheet.scale - this.currentSheet.buffer * 2
    },
    sheets: store.sprite.sheet.all,
    currentSheet() {
      return store.sprite.sheet.state.byName[this.$route.params.name]
    },
    css() {
      const { scale } = this.currentSheet || {}
      const box = (index) => {
        const [x, y] = this.geo.index2xy(index)
        return {
          left: `${x * scale}px`,
          top: `${y * scale}px`,
          height: `${scale}px`,
          width: `${scale}px`,
        }
      }
      return { box, selected: box(this.selected), hovering: box(this.hovering) }
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
        const canvas = document.createElement('canvas')
        canvas.width = canvas.height = this.outSize
        this.drawTo(canvas)
        const a = document.createElement('a')
        a.href = canvas.toDataURL()
        a.download = 'sprite.png'
        a.click()
        return
      }
      this.selected = this.selected === this.hovering ? undefined : this.hovering
      this.selected !== undefined && this.drawTo(this.$refs.preview)
      setTimeout(() => this.$el.querySelector('input').focus())
    },
    mousemove(event) {
      const { scale } = this.currentSheet
      const last_index = this.hovering
      this.hovering = this.geo.xy2index([
        Math.floor(event.offsetX / scale),
        Math.floor(event.offsetY / scale),
      ])
      if (last_index !== this.hovering && this.selected === undefined) {
        this.drawTo(this.$refs.preview)
      }
      if (event.buttons === 1) {
        this.selected = this.hovering
      }
    },
    drawTo(canvas) {
      const sw = this.outSize
      const [x, y] = this.geo.index2xy(this.hovering)
      const img = store.sprite.sheet.getImage(this.$route.params.name)
      const { scale, buffer } = this.currentSheet
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingEnabled = false
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const sx = x * scale + buffer
      const sy = y * scale + buffer
      ctx.drawImage(img, sx, sy, sw, sw, 0, 0, canvas.width, canvas.height)
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
    rename() {
      if (!this.currentSheet.sprites[this.selected]) {
        delete this.currentSheet.sprites[this.selected]
      }
      this.saveState()
    },
  },
}
</script>
