<template>
  <div @click="toggleFocus">
    <i class="fa fa-floppy-o btn btn-primary" />
    <popper v-if="focused">
      <div class="btn btn-primary" @click="save">
        <i class="fa fa-download mr-2" />
        Save data
      </div>
      <label class="btn btn-primary block">
        <i class="fa fa-upload mr-2" />
        Restore data
        <input type="file" style="display: none" @change="restore" />
      </label>
    </popper>
  </div>
</template>

<script>
import { exportJson, importJson } from '@/store'
import FocusMixin from '@/FocusMixin'

export default {
  mixins: [FocusMixin],
  methods: {
    save: exportJson,
    restore(event) {
      const fr = new FileReader()
      fr.onload = () => {
        importJson(fr.result)
      }
      fr.readAsText(event.target.files[0])
    },
  },
}
</script>
