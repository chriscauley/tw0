export default {
  data: () => ({ focused: false }),
  methods: {
    onFocus() {},
    onBlur() {},
    toggleFocus(e) {
      if (e.__dropdown_touched !== this) {
        e.__dropdown_touched = e.__dropdown_touched || this
        if (this.focused) {
          document.removeEventListener('click', this.toggleFocus)
          this.onFocus()
        } else {
          document.addEventListener('click', this.toggleFocus)
          this.onBlur()
        }
        this.focused = !this.focused
      }
    },
  },
}
