<template>
  <div @click="toggleFocus">
    <div class="relative">
      <i class="fa fa-tag btn btn-primary" />
      <div v-if="currentTag" class="current-tag-color" :style="css.bg" />
    </div>
    <popper v-if="focused" @click.stop>
      <div class="tags-popper">
        <div class="tag">
          <i :class="css.radio({ id: null })" @click="select({ id: null })" /> Rename Tool
        </div>
        <div v-for="tag in tags" :key="tag.id" class="tag">
          <i :class="css.radio(tag)" @click="select(tag)" />
          <div class="swatch" :style="`background: ${tag.color}`" />
          <span class="name">{{ tag.name }}</span>
          <div class="flex-grow" />
          <i class="fa fa-edit" @click="editing = tag" />
        </div>
        <form class="flex" @submit.prevent="submit">
          <input class="text-black" style="width: 6rem" v-model="editing.name" ref="input" />
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
    tags: store.sprite.tag.all,
    sheets: store.sprite.sheet.all,
    css() {
      const { id, color } = this.currentTag || {}
      return {
        bg: `background: ${color}`,
        radio: (tag) => `fa fa-circle${tag.id === id ? '' : '-o'}`,
      }
    },
    currentTag: () => store.sprite.tag.state.list[store.sprite.tag.state.selected],
    currentSheet() {
      return store.sprite.sheet.state.byName[this.$route.params.name]
    },
  },
  mounted() {
    this.$refs.input?.focus()
  },
  methods: {
    select(tag) {
      store.sprite.tag.update({ selected: tag.id })
    },
    submit() {
      const { editing } = this
      if (editing.id === undefined) {
        store.sprite.tag.add(this.editing)
      }
      store.sprite.tag.update()
      this.editing = { color: '#000000' }
      this.$refs.input.focus()
    },
  },
}
</script>
