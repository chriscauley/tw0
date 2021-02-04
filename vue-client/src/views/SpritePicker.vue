<template>
  <div>
    <router-link
      class="block"
      v-for="sheet in sheets"
      :key="sheet.name"
      :to="`/sprite-picker/${sheet.name}/`"
    >
      {{ sheet.name }}
    </router-link>
  </div>
</template>

<script>
import store from '@/store'

export default {
  __route: {
    path: '/sprite-picker/:name?',
  },
  computed: {
    sheets: () => store.sprite.sheet.state.list,
  },
}
</script>
