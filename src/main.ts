import 'virtual:uno.css'
import 'virtual:base.css'

import { createSSRApp } from 'vue'
import App from './App.vue'
import { createRouter, RouterSymbol } from './router/router'
import ExpanderComponent from './components/ExpanderComponent.vue'

const activityModules = import.meta.glob('./data/activities/*.md')
const newsModules = import.meta.glob('./data/news/*.md')

export function createApp() {
  const app = createSSRApp(App)
  const router = createRouter()

  app.provide(RouterSymbol, router)
  app.provide('activityModules', activityModules)
  app.provide('newsModules', newsModules)
  app.component('ExpanderComponent', ExpanderComponent)
  return { app, router }
}
