<template>
  <div>
    <router-view class="app-view" />
  </div>
</template>

<script>
import types from 'tw/piece/types'

export default {
  name: 'App',
  data() {
    return { slugs: types.slugs }
  },
}
</script>
