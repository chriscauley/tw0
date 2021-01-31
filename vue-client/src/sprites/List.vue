<template>
  <div class="sprite-list">
    <div v-for="(cls, key) in registry" :key="key" class="item">
      <div :class="cls" />
      {{ key }}
    </div>
  </div>
</template>

<script>
import Sprite from './Sprite'

Sprite('floorstairs')
Sprite('floor0')
Sprite('floor1')
Sprite('floorlock')
Sprite('wall0')
Sprite('wall1')
Sprite('wall2')
Sprite('wall3')
Sprite('wall4')
Sprite('bat.awake')
Sprite('node-1')
Sprite('node-2')

export default {
  __route: {
    path: '/sprite/list/',
    name: 'spritelist',
  },
  data() {
    return { registry: Sprite.registry }
  },
}
</script>
