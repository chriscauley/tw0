const EVENTS = ['keydown', 'keyup']

export default {
  mounted() {
    EVENTS.forEach((event) => {
      this[event] && document.addEventListener(event, this[event])
    })
  },
  beforeUnmount() {
    EVENTS.forEach((event) => {
      this[event] && document.removeEventListener(event, this[event])
    })
  },
}
