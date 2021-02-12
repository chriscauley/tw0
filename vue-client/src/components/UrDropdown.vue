<template>
  <div @click="toggleFocus">
    <div class="btn btn-primary">
      <i v-if="icon" :class="`fa fa-${icon}`" />
      <slot />
    </div>
    <popper v-if="focused">
      <div class="flex flex-col bg--bg-alt p-4">
        <div v-for="item in preppedItems" v-bind="item.attrs" v-is="item.tagName" :key="item.key">
          <i v-if="item.icon" :class="`fa fa-${item.icon}`" />
          {{ item.text }}
        </div>
      </div>
    </popper>
  </div>
</template>

<script>
import FocusMixin from '@/FocusMixin'
const prepItem = (item) => {
  if (typeof item === 'string') {
    item = { text: item, to: item }
  }
  item.attrs = item.attrs || {}
  item.tagName = 'div'
  if (item.to) {
    item.attrs.to = item.to
    item.tagName = 'router-link'
  }
  if (item.click) {
    item.attrs.onclick = item.click
    item.attrs.class = 'cursor-pointer'
  }
  item.key = item.key || item.text || item.icon
  return item
}

export default {
  mixins: [FocusMixin],
  props: {
    items: Array,
    icon: String,
  },
  computed: {
    preppedItems() {
      return this.items.map(prepItem)
    },
  },
}
</script>
