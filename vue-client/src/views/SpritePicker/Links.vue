<template>
  <div @click="toggleFocus">
    <i class="fa fa-link btn btn-primary" />
    <popper v-if="focused">
      <div class="flex flex-col bg--bg p-4">
        <router-link
          class="mr-2"
          v-for="sheet in sheets"
          :key="sheet.name"
          :to="`/sprite-picker/${sheet.name}/`"
        >
          {{ sheet.name }}
        </router-link>
      </div>
    </popper>
  </div>
</template>

<script>
import store from '@/store'
import FocusMixin from '@/FocusMixin'

export default {
  mixins: [FocusMixin],
  computed: {
    sheets: store.sprite.sheet.all,
    currentSheet() {
      return store.sprite.sheet.state.byName[this.$route.params.name]
    },
  },
}
</script>
