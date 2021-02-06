export default {
  data: () => ({ focused: false }),
  methods: {
    toggleFocus(e) {
      if (e.__dropdown_touched !== this) {
        e.__dropdown_touched = e.__dropdown_touched || this
        const action = `${this.focused ? 'remove' : 'add'}EventListener`
        document[action]('click', this.toggleFocus)
        this.focused = !this.focused
      }
    },
  },
}
