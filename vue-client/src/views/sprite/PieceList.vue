<template>
  <div class="sprite-list2 sprite-piece-list">
    <div v-if="errors.length" class="alert alert-danger">missing: {{ errors }}</div>
    <div class="sheet-sprites">
      <div v-for="sprite in sprites" :key="sprite" class="box">
        <div :class="sprite" />
        <div class="text">{{ sprite.replace('sprite sprite-', '') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import types from 'tw/piece/types'
import Sprite from './Sprite'

export default {
  __route: {
    path: '/sprite/piece-list',
  },
  computed: {
    inverted() {
      const inverted = {}
      store.sheet.all().forEach((sheet) => {
        Object.entries(sheet.sprites).forEach(([index, slug]) => {
          if (inverted[slug]) {
            this.errors.push('Duplicate sprite: ' + slug)
          }
          index = Number(index)
          inverted[slug] = { slug, sheet, index }
        })
      })
      return inverted
    },
    slugs() {
      if (!store.sheet.imagesAreLoaded(this.$forceUpdate)) {
        return []
      }
      const slugs = []
      types.slugs.forEach((slug) => {
        const type = types[slug]
        slugs.push(type.sprite)
        type.sprites?.forEach((s) => slugs.push(s))
      })
      slugs.sort()
      return slugs
    },
    errors() {
      return this.slugs.filter((s) => !this.inverted[s])
    },
    sprites() {
      return this.slugs
        .filter((s) => this.inverted[s])
        .map((slug) => {
          const { sheet, index } = this.inverted[slug]
          return Sprite.getPieceSprite(slug, sheet, index)
        })
    },
  },
}
</script>
