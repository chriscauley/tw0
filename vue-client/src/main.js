import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './styles/base.scss'
import '@unrest/tailwind/dist.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
