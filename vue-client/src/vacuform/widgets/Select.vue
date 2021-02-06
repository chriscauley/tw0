<template>
  <select @change="onChange" :value="modelValue" :id="field.id" class="form-control">
    <option v-for="choice in choices" :value="choice.value" :key="choice.name">
      {{ choice.name }}
    </option>
  </select>
</template>

<script>
export default {
  props: {
    modelValue: null,
    field: Object,
    form: Object,
  },
  emits: ['update:modelValue'],
  computed: {
    choices() {
      const names = this.field.enumNames || this.field.enum
      return this.field.enum.map((value, i) => ({
        value,
        name: names[i],
      }))
    },
  },
  methods: {
    onChange(e) {
      this.$emit('update:modelValue', e.target.value)
    },
  },
}
</script>
