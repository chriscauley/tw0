<template>
  <div class="sprite-picker">
    <div class="canvas-wrapper" v-if="currentSheet">
      <canvas ref="canvas" @mousemove="mousemove" @click="click" />
      <div class="hovering" :style="css.hovering" />
      <div v-if="selected !== undefined" class="selected" :style="css.selected" />
      <div v-for="i in namedIndexes" :key="i" class="named" :style="css.box(i)" />
      <div v-for="tag in preppedTags" :key="tag.id" :style="`--tag-color: ${tag.color}`">
        <div v-for="index in tag.indexes" class="tagged" :style="css.box(index)" :key="index" />
      </div>
    </div>
    <div class="page-actions">
      <tags />
      <ur-dropdown :items="links" icon="link" />
      <ur-dropdown :items="actions" icon="floppy-o" />
      <settings />
    </div>
    <div class="preview">
      <canvas ref="preview" :width="4 * outSize" :height="4 * outSize" />
      <input
        v-if="selected !== undefined"
        :style="`width: ${4 * outSize}px`"
        class="rename-input"
        v-model="currentSheet.sprites[selected]"
        @input="rename"
      />
    </div>
    <input id="picker-restore" type="file" @change="restore" style="display: none" />
  </div>
</template>

<script>
import store, { exportJson, importJson } from '@/store'
import Settings from './Settings'
import Tags from './Tags'
import FocusMixin from '@/FocusMixin'
import Geo from 'tw/Geo'

export default {
  components: { Settings, Tags },
  mixins: [FocusMixin],
  data() {
    const { schema } = store.sheet
    return {
      hovering: null,
      selected: undefined,
      schema,
      geo: Geo(5, 5),
      tagged: [],
    }
  },
  __route: {
    path: '/sprite/picker/:name?',
  },
  computed: {
    actions() {
      const clickFile = () => this.$el.querySelector('[type=file]').click()
      return [
        { icon: 'download', text: 'Save data', click: exportJson },
        { icon: 'upload', text: 'Restore data', click: clickFile },
      ]
    },
    links() {
      return [
        { to: '/', text: 'Home' },
        ...this.sheets.map((s) => {
          const text = s.fname.replace(/\..*/, '').split('/').pop()
          return { to: `/sprite/picker/${text}`, text }
        }),
      ]
    },
    preppedTags() {
      delete this.currentSheet.tags.null
      return store.tag.state.list
        .filter((t) => !t.hidden)
        .map((tag) => ({
          ...tag,
          indexes: this.currentSheet.tags[tag.id],
        }))
    },
    namedIndexes() {
      return Object.keys(this.currentSheet.sprites).map(Number)
    },
    outSize() {
      return this.currentSheet.scale - this.currentSheet.buffer * 2
    },
    sheets: store.sheet.all,
    currentSheet() {
      return store.sheet.state.byName[this.$route.params.name]
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
    mode() {
      const { selected } = store.tag.state
      if (null === selected || undefined === selected) {
        return 'rename'
      }
      return 'tag'
    },
  },
  watch: {
    currentSheet: 'redraw',
    'currentSheet.scale': 'redraw',
    hovering() {
      this.drawTo(this.$refs.preview)
    },
  },
  mounted() {
    this.redraw()
  },
  methods: {
    restore(event) {
      const fr = new FileReader()
      fr.onload = () => {
        importJson(fr.result)
      }
      fr.readAsText(event.target.files[0])
    },
    saveState() {
      store.sheet.update()
    },
    click(event) {
      if (this.mode === 'rename') {
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
        setTimeout(() => {
          const input = this.$el.querySelector('.rename-input')
          input.focus()
          input.style.backgroundImage = `url(${this.$refs.preview.toDataURL()})`
        })
      } else if (this.mode === 'tag') {
        this.doTag(event)
      }
    },
    doTag(event) {
      const { selected } = store.tag.state
      const tagIndexes = (this.currentSheet.tags[selected] = this.currentSheet.tags[selected] || [])
      if (event.shiftKey) {
        if (tagIndexes.includes(this.hovering)) {
          this.currentSheet.tags[selected] = tagIndexes.filter((i) => i !== this.hovering)
        }
      } else if (!tagIndexes.includes(this.hovering)) {
        tagIndexes.push(this.hovering)
      }
      store.sheet.update()
    },
    mousemove(event) {
      const { scale } = this.currentSheet
      this.hovering = this.geo.xy2index([
        Math.floor(event.offsetX / scale),
        Math.floor(event.offsetY / scale),
      ])
      if (event.buttons === 1) {
        if (this.mode === 'rename') {
          this.selected = this.hovering
        } else if (this.mode === 'tag') {
          this.doTag(event)
        }
      }
    },
    drawTo(canvas) {
      const sw = this.outSize
      const [x, y] = this.geo.index2xy(this.hovering)
      const img = store.sheet.getImage(this.currentSheet.fname)
      const { scale, buffer } = this.currentSheet
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingEnabled = false
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const sx = x * scale + buffer
      const sy = y * scale + buffer
      ctx.drawImage(img, sx, sy, sw, sw, 0, 0, canvas.width, canvas.height)
    },
    redraw() {
      if (!this.currentSheet) {
        return
      }
      const img = store.sheet.getImage(this.currentSheet.fname, this.redraw)
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
