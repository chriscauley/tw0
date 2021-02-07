<template>
  <div>
    <div v-for="link in links" :key="link">
      <router-link :to="link">{{ link }}</router-link>
    </div>
  </div>
</template>

<script>
import store from '@/store'
const links = [
  '/docs/vacuform/',
  '/docs/css/',
  '/sprite/list/',
  '/sprite/list2/',
  '/coloseum/9x9/bat/',
]
store.sprite.sheet.all().forEach(sheet => links.push(`/sprite-picker/${sheet.name}`))
export default {
  __route: {
    path: '/',
  },
  data: () => ({ links }),
}
</script>
