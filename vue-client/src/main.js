import { createApp } from 'vue'

import store from '@/store'
import App from './App.vue'
import Vacuform from './vacuform'
import Popper from '@/components/Popper'
import router from './router'
import Stats from 'stats.js'

import './styles/base.scss'
import '@unrest/tailwind/dist.css'

function main() {
  const app = createApp(App)
  app.use(router)
  app.mount('#app')
  app.component('Popper', Popper)
  app.component('Vacuform', Vacuform)
  store.init()
}

main()

// TODO v-hotkey
const doStats = (event) => {
  if (event.shiftKey && event.ctrlKey && event.key === 'S') {
    const stats = new Stats()
    stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom)
    requestAnimationFrame(function loop() {
      stats.update()
      requestAnimationFrame(loop)
    })
    document.removeEventListener('keypress', doStats)
  }
}

document.addEventListener('keypress', doStats)
