import 'virtual:uno.css'
import './assets/base.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, RouterSymbol } from './router/router'

const app = createApp(App)
const router = createRouter()

app.provide(RouterSymbol, router)

router.go().then(() => {
  app.mount('#app')
})
