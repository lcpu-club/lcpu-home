import 'virtual:uno.css'
import './assets/base.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, RouterSymbol } from './router/router'

const activityModules = import.meta.glob('./data/activities/*.md')
const newsModules = import.meta.glob('./data/news/*.md')

const app = createApp(App)
const router = createRouter()

app.provide(RouterSymbol, router)
app.provide('activityModules', activityModules)
app.provide('newsModules', newsModules)

router.go().then(() => {
  app.mount('#app')
})
