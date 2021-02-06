<template>
  <div :class="css.root">
    <label v-if="showLabel(field)" :for="field.id">{{ field.title }}</label>
    <div class="input-wrapper">
      <div
        v-is="field.ui.tagName"
        :field="field"
        :modelValue="modelValue"
        @update:modelValue="(value) => change(field.name, value)"
      />
    </div>
    <div v-if="error" class="error">
      {{ error }}
    </div>
    <div v-else-if="field.description" class="description">
      {{ field.description }}
    </div>
  </div>
</template>

<script>
import VfSelect from './widgets/Select'
import VfCheckbox from './widgets/Checkbox'
import VfRange from './widgets/Range'
import VfText from './widgets/Text'

export default {
  components: { VfText, VfSelect, VfCheckbox, VfRange },
  props: {
    field: Object,
    form: Object,
    modelValue: null,
    change: Function,
  },
  data() {
    return { showError: false }
  },
  computed: {
    ui() {
      return this.field.ui
    },
    error() {
      return this.$attrs.error
    },
    css() {
      return {
        root: [`form-group form-group__${this.field.name}`, { '-error': this.error }],
      }
    },
  },
  methods: {
    showLabel(field) {
      return field.title && !['vf-checkbox'].includes(field.ui.tagName)
    },
  },
}
</script>
