import { createApp } from 'vue'

import store from '@/store'
import App from './App.vue'
import Vacuform from './vacuform'
import Popper from '@/components/Popper'
import router from './router'

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
