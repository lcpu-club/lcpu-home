import 'virtual:uno.css'
import './assets/base.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, RouterSymbol } from './router/router'

const activityModules = import.meta.glob('./data/activities/*.md')
const newsModules = import.meta.glob('./data/news/*.md')

for (const path in activityModules) {
  activityModules[path]().then((mod) => {
    console.log(path, mod)
  })
}

for (const path in newsModules) {
  newsModules[path]().then((mod) => {
    console.log(path, mod)
  })
}

const app = createApp(App)
const router = createRouter()

app.provide(RouterSymbol, router)
app.provide('activityModules', activityModules)
app.provide('newsModules', newsModules)

router.go().then(() => {
  app.mount('#app')
})
