<template>
  <div>
    <router-link to="/" class="fa fa-home" />
    <router-view class="app-view" />
  </div>
</template>

<script>
import types from 'tw/piece/types'

document.body.classList.add('theme-dark_mode')
export default {
  name: 'App',
  data() {
    return { slugs: types.slugs }
  },
}
</script>
