<template>
  <div>
    <i class="fa fa-pencil btn btn-primary" @click="toggleFocus" />
    <popper v-if="focused" @click.stop class="popdown">
      <vacuform :schema="schema" :state="currentSheet" :onChange="saveState">
        <template #actions>
          <span />
        </template>
      </vacuform>
    </popper>
  </div>
</template>

<script>
import store from '@/store'
import FocusMixin from '@/FocusMixin'

export default {
  mixins: [FocusMixin],
  data: () => ({ schema: store.sheet.schema }),
  computed: {
    currentSheet() {
      return store.sheet.state.byName[this.$route.params.name]
    },
  },
  methods: {
    saveState() {
      store.sheet.update()
    },
  },
}
</script>
