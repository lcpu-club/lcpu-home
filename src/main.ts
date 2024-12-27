import 'virtual:uno.css'
import 'virtual:base.css'
import '@/assets/codeblocks.css'

import { createSSRApp } from 'vue'
import App from './App.vue'
import { createRouter, RouterSymbol } from './router/router'
import ExpanderComponent from './components/ExpanderComponent.vue'

const pageModules = import.meta.glob('./data/*/*.md')

export function createApp() {
  const app = createSSRApp(App)
  const router = createRouter()

  app.provide(RouterSymbol, router)
  app.provide('pageModules', pageModules)
  app.component('ExpanderComponent', ExpanderComponent)
  return { app, router }
}
