<!-- eslint-disable vue/no-mutating-props -->
<template>
  <form @submit.prevent="submit" class="vacuform">
    <Field
      v-model="state[field.name]"
      v-for="field in fields"
      :key="field.id"
      :field="field"
      :change="change"
    />
    <slot name="actions">
      <button type="submit" class="btn btn-primary">Submit</button>
    </slot>
    <div v-if="error" class="form-error">
      {{ error }}
    </div>
  </form>
</template>

<script>
import { reactive } from 'vue'
import prepFields from './prepFields'
import Field from './Field'

export default {
  components: { Field },
  props: {
    schema: Object,
    uiSchema: Object,
    state: {
      type: Object,
      default: () => reactive({}),
    },
    onSubmit: {
      type: Function,
      default: () => {},
    },
    onChange: {
      type: Function,
      default: () => {},
    },
  },
  data: () => ({ error: null }),
  computed: {
    fields() {
      return prepFields(this.schema, this.uiSchema)
    },
  },
  beforeMount() {
    const { state, fields } = this
    fields.forEach((field) => {
      if (!state.hasOwnProperty(field.name)) {
        state[field.name] = field.default
      }
    })
  },
  methods: {
    handleError(e) {
      throw e
    },
    change(name, value) {
      this.state[name] = value // eslint-disable-line
      this.onChange(this.state, { name, value })
    },
    submit() {
      this.error = undefined
      try {
        this.onSubmit(this.state)?.catch(this.handleError)
      } catch (e) {
        this.handleError(e)
      }
    },
  },
}
</script>
