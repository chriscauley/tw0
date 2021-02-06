<template>
  <div>
    <div v-for="link in links" :key="link">
      <router-link :to="link">{{ link }}</router-link>
    </div>
  </div>
</template>

<script>
const links = [
  '/docs/vacuform/',
  '/docs/css/',
  '/sprite/list/',
  '/coloseum/9x9/bat/',
  '/sprite-picker/',
]
export default {
  __route: {
    path: '/',
  },
  data: () => ({ links }),
}
</script>
