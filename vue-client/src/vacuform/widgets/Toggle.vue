<template>
  <label :class="css">
    <input type="checkbox" :checked="modelValue" @change="onChange" />
    <div class="switch">
      <div class="toggle"></div>
    </div>
    {{ field.title }}
  </label>
</template>

<script>
export default {
  props: {
    modelValue: Boolean,
    field: Object,
  },
  emits: ['update:modelValue'],
  computed: {
    css() {
      return [
        this.field.ui.css,
        {
          'vf-toggle': true,
          '-checked': this.modelValue,
          '-disabled': this.field.disabled,
        },
      ]
    },
  },
  methods: {
    onChange() {
      if (this.field.disabled) {
        return
      }
      this.$emit('update:modelValue', !this.modelValue)
    },
  },
}
</script>
