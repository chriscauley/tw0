<template>
  <div @click="opened = true" class="relative">
    <i class="fa fa-gear" @click="toggleFocus" />
    <popper v-if="focused" class="popdown">
      <vacuform :state="state" :schema="schema" style="min-width: 150px" :onChange="save">
        <template #actions><span /></template>
      </vacuform>
    </popper>
  </div>
</template>

<script>
import settings from '@/store/settings'
import FocusMixin from '@/FocusMixin'

export default {
  mixins: [FocusMixin],
  computed: {
    state: () => settings.state,
    schema: () => settings.schema,
  },
  methods: {
    save: () => settings.update(),
  },
}
</script>
