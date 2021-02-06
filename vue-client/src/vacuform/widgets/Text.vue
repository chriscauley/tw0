<template>
  <input v-bind="inputAttrs" @input="onChange" class="form-control" />
</template>

<script>
import { pick } from 'lodash'

const coerce = (value, field = {}) => {
  if (field.type === 'number') {
    // Number('') coerces to 0 :face-palm
    return value === '' ? NaN : Number(value)
  }
  return value
}

export default {
  props: {
    modelValue: null,
    field: Object,
  },
  emits: ['update:modelValue'],
  data() {
    return { showError: false }
  },
  computed: {
    inputAttrs() {
      const attrs = pick(this.field, ['name', 'disabled', 'placeholder', 'id'])
      attrs.value = this.modelValue
      attrs.type = this.field.ui.type
      attrs.class = 'form-control'
      return attrs
    },
  },
  methods: {
    onChange(e) {
      // TODO maybe use e.target.checkValidity()?
      // note: without step a value of 0.1 is considered invalid by input[type=number]
      const value = coerce(e.target.value, this.field)
      if (this.field.type === 'number' && isNaN(value)) {
        // TODO move to form level: validate and don't coerce/dupdateSstate/onChange if invalid
        return
      }
      this.$emit('update:modelValue', value)
    },
  },
}
</script>
