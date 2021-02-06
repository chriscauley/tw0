<template>
  <div class="popper">
    <slot />
  </div>
</template>

<script>
import { createPopper } from '@popperjs/core'

export default {
  props: {
    target: Object, // DOM element
    placement: String,
    offset: Array, // [ skid, distance ]
  },
  data() {
    return { popper: null }
  },
  watch: {
    target: 'reset',
  },
  mounted() {
    this.reset()
  },
  unmount() {
    this.popper.destroy()
  },
  methods: {
    reset() {
      this.popper?.destroy()
      const modifiers = []
      if (this.offset) {
        modifiers.push({
          name: 'offset',
          options: { offset: this.offset },
        })
      }
      const { placement = 'bottom-start', target = this.$el.parentElement } = this
      this.popper = createPopper(target, this.$el, { placement, modifiers })
    },
  },
}
</script>
