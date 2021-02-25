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
  '/sprite/piece-list/',
  '/play/coloseum/9x9/bat/',
  '/play/disco/9x9/bat/',
  '/play/soccer/9x9/ball/',
]
store.sheet.all().forEach((sheet) => links.push(`/sprite/picker/${sheet.name}`))
export default {
  __route: {
    path: '/',
  },
  data: () => ({ links }),
}
</script>
