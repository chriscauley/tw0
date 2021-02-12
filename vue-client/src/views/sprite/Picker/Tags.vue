<template>
  <div @click="toggleFocus">
    <div class="relative">
      <i class="fa fa-tag btn btn-primary" />
      <div v-if="currentTag" class="current-tag-color" :style="css.bg" />
    </div>
    <popper v-if="focused" @click.stop placement="top" class="popdown">
      <div class="tags-popper">
        <div class="tag"><i :class="css.radioNull" @click="select({})" /> Rename Tool</div>
        <div v-for="tag in tags" :key="tag.id" class="tag">
          <i :class="css.radio(tag)" @click="select(tag)" />
          <div class="swatch" :style="`background: ${tag.color}`" />
          <span class="name">{{ tag.name }}</span>
          <div class="flex-grow" />
          <i :class="css.eyecon(tag)" @click="tag.hidden = !tag.hidden" />
          <i class="fa fa-edit" @click="editing = tag" />
        </div>
        <form class="flex" @submit.prevent="submit">
          <input v-model="editing.name" ref="input" />
          <input type="color" v-model="editing.color" class="h-8" />
          <button class="btn btn-primary fa fa-check" />
        </form>
      </div>
    </popper>
  </div>
</template>

<script>
import store from '@/store'
import FocusMixin from '@/FocusMixin'

window.$store = store

export default {
  mixins: [FocusMixin],
  data() {
    return { editing: { color: '#000000' } }
  },
  computed: {
    tags: store.tag.all,
    sheets: store.sheet.all,
    css() {
      const { id = null, color } = this.currentTag || {}
      return {
        bg: `background: ${color}`,
        radioNull: `fa fa-circle${id === null ? '' : '-o'}`,
        radio: (tag) => `fa fa-circle${tag.id === id ? '' : '-o'}`,
        eyecon: (tag) => `fa fa-eye${tag.hidden ? '-slash' : ''}`,
      }
    },
    currentTag: () => store.tag.state.list[store.tag.state.selected],
    currentSheet() {
      return store.sheet.state.byName[this.$route.params.name]
    },
  },
  mounted() {
    this.$refs.input?.focus()
  },
  methods: {
    select(tag) {
      store.tag.update({ selected: tag.id })
    },
    submit() {
      const { editing } = this
      if (editing.id === undefined) {
        store.tag.add(this.editing)
        store.tag.state.selected = this.editing.id
      }
      store.tag.update()
      this.editing = { color: '#000000' }
      this.$refs.input.focus()
    },
  },
}
</script>
