<template>
  <div class="sprite-list2">
    <div v-if="editing" class="modal">
      <div class="modal-mask" @click="editing = null" />
      <div class="modal-content">
        <vacuform :schema="schema" :state="editing" :onSubmit="save" />
      </div>
    </div>
    <div v-for="sheet in sheets" :key="sheet.fname">
      <h4>
        <router-link class="fa fa-edit" :to="`/sprite-picker/${sheet.name}/`" />
        {{ sheet.summary }}
      </h4>
      <div class="sheet-sprites">
        <div v-for="sprite in sheet.sprites" :key="sprite.index" class="box">
          <div :class="sprite.css" />
          <div class="text" @click="edit(sprite)">{{ sprite.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { sortBy } from 'lodash'
import store from '@/store'
import Sprite from './Sprite'

const getSummary = (sheet, sprites) => {
  const tag_sprite_count = Object.values(sheet.tags).reduce((acc, arr) => acc + arr.length, 0)
  const tag_count = Object.keys(sheet.tags).length
  return `${sheet.fname} s=${sprites.length} t=${tag_sprite_count}/${tag_count}`
}

const schema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
  },
}

export default {
  __route: {
    path: '/sprite/list2',
  },
  data() {
    return { editing: null, schema }
  },
  computed: {
    sheets() {
      const sheets = store.sprite.sheet.all().filter((s) => Object.keys(s.sprites).length)
      if (
        sheets.find((sheet) => !store.sprite.sheet.getImage(sheet.fname, () => this.$forceUpdate()))
      ) {
        // TODO lazy way to force images to be loaded
        return []
      }
      return sheets.map((sheet) => {
        const sprites = Object.entries(sheet.sprites).map(([index, name]) => ({
          index: Number(index),
          name,
          css: Sprite.getSheetSprite(sheet, index),
          sheet,
        }))
        return {
          ...sheet,
          sprites: sortBy(sprites, 'name'),
          summary: getSummary(sheet, sprites),
        }
      })
    },
  },
  methods: {
    edit(sprite) {
      this.editing = { ...sprite }
      setTimeout(() => document.querySelector('.modal-content input').select())
    },
    save(data) {
      const { sheet, name, index } = data
      sheet.sprites[index] = name
      store.sprite.sheet.update()
      this.editing = null
    },
  },
}
</script>
