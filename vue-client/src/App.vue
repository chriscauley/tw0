<template>
  <div>types: {{ slugs.join(', ') }}</div>
</template>

<script>
import types from 'tw/piece/types'
export default {
  runtimeCompiler: true,
  name: 'App',
  data() {
    return { slugs: types.slugs }
  },
}
</script>

<style></style>
