import { createApp } from 'vue'
import './assets/main.css'
import App from './App.vue'

import { createPinia } from 'pinia'
import { router } from './router/index'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
