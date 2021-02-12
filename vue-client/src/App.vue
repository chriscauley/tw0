<template>
  <div>
    <router-link to="/" class="fa fa-home" />
    <router-view class="app-view" />
    <ur-ui />
  </div>
</template>

<script>
import types from 'tw/piece/types'
import ui from '@/store/ui'

document.body.classList.add('theme-dark_mode')
export default {
  name: 'App',
  components: { UrUi: ui.Component },
  data() {
    return { slugs: types.slugs }
  },
}
</script>
