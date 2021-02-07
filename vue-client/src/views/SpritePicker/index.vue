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
    <div class="actions">
      <tags />
      <links />
      <settings />
      <ImportExport />
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
  </div>
</template>

<script>
import store from '@/store'
import Links from './Links'
import ImportExport from './ImportExport'
import Settings from './Settings'
import Tags from './Tags'
import FocusMixin from '@/FocusMixin'
import Geo from 'tw/Geo'

export default {
  components: { ImportExport, Links, Settings, Tags },
  mixins: [FocusMixin],
  data() {
    const { schema } = store.sprite.sheet
    return {
      hovering: null,
      selected: undefined,
      schema,
      geo: Geo(5, 5),
      tagged: [],
    }
  },
  __route: {
    path: '/sprite-picker/:name?',
  },
  computed: {
    preppedTags() {
      delete this.currentSheet.tags.null
      return store.sprite.tag.state.list
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
    mode() {
      const { selected } = store.sprite.tag.state
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
    saveState() {
      store.sprite.sheet.update()
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
      const { selected } = store.sprite.tag.state
      const tagIndexes = (this.currentSheet.tags[selected] = this.currentSheet.tags[selected] || [])
      if (event.shiftKey) {
        if (tagIndexes.includes(this.hovering)) {
          this.currentSheet.tags[selected] = tagIndexes.filter((i) => i !== this.hovering)
        }
      } else if (!tagIndexes.includes(this.hovering)) {
        tagIndexes.push(this.hovering)
      }
      store.sprite.sheet.update()
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
      const img = store.sprite.sheet.getImage(this.currentSheet.fname)
      const { scale, buffer } = this.currentSheet
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingEnabled = false
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const sx = x * scale + buffer
      const sy = y * scale + buffer
      ctx.drawImage(img, sx, sy, sw, sw, 0, 0, canvas.width, canvas.height)
    },
    redraw() {
      const img = store.sprite.sheet.getImage(this.currentSheet.fname, this.redraw)
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
