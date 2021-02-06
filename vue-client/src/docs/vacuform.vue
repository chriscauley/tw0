<template>
  <div class="docs-form">
    <vf-vacuform :schema="schema" :state="state" />
    <pre>{{ JSON.stringify(state, null, 2) }}</pre>
  </div>
</template>

<script>
import { reactive } from 'vue'
import VfVacuform from '@/vacuform'

const state = reactive({})

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    age: {
      type: 'number',
    },
    color: {
      type: 'string',
      format: 'color',
    },
    stars: {
      type: 'number',
      default: 1,
      ui: {
        tagName: 'vf-range',
        step: 1,
        max: 5,
        min: 1,
      },
    },
    peanut_butter: {
      type: 'string',
      enum: ['smooth', 'crunchy'],
    },
    terms: {
      title: 'I accept the terms.',
      type: 'boolean',
    },
  },
}

export default {
  __route: {
    path: '/docs/vacuform',
  },
  components: { VfVacuform },
  data() {
    return { schema, state }
  },
}
</script>
