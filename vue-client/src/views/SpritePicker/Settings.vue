<template>
  <div>
    <i class="fa fa-pencil btn btn-primary" @click="toggleFocus" />
    <popper v-if="focused">
      <vacuform :schema="schema" :state="currentSheet" :onChange="saveState"><span /></vacuform>
    </popper>
  </div>
</template>

<script>
import store from '@/store'
import FocusMixin from '@/FocusMixin'

export default {
  mixins: [FocusMixin],
  data: () => ({ schema: store.sprite.sheet.schema }),
  computed: {
    currentSheet() {
      return store.sprite.sheet.state.byName[this.$route.params.name]
    },
  },
  methods: {
    saveState() {
      store.sprite.sheet.update()
    },
  },
}
</script>
