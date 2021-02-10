<template>
  <div class="sprite-list2 sprite-piece-list">
    <div v-if="sprites.errors.length" class="alert alert-danger">missing: {{ sprites.errors }}</div>
    <div class="sheet-sprites">
      <div v-for="sprite in sprites.exists" :key="sprite" class="box">
        <div :class="sprite" />
        <div class="text">{{ sprite.replace('sprite sprite-', '') }}</div>
      </div>
    </div>
    <div class="page-actions">
      <i class="fa fa-download btn btn-primary" @click="downloadSprites" />
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
    sprites() {
      const exists = []
      const errors = []
      if (!store.sheet.imagesAreLoaded(this.$forceUpdate)) {
        return { exists, errors }
      }
      const slugs = [
        'floor0',
        'floor1',
        'wall0',
        'wall1',
        'wall2',
        'wall3',
        'wall4',
        'node-1',
        'node-2',
      ]
      types.slugs.forEach((slug) => {
        const type = types[slug]
        slugs.push(type.sprite)
        type.sprites?.forEach((s) => slugs.push(s))
      })
      const inverted = {}
      store.sheet.all().forEach((sheet) => {
        Object.entries(sheet.sprites).forEach(([index, slug]) => {
          index = Number(index)
          inverted[slug] = { slug, sheet, index }
        })
      })
      slugs.forEach((slug) => {
        if (inverted[slug]) {
          const { sheet, index } = inverted[slug]
          exists.push(Sprite.getPieceSprite(slug, sheet, index))
        } else if (Sprite.exists(slug)) {
          exists.push(Sprite.css(slug))
        } else {
          errors.push(slug)
        }
      })
      exists.sort()
      return { exists, errors }
    },
  },
  methods: {
    downloadSprites() {
      Sprite.downloadJson()
    },
  },
}
</script>
