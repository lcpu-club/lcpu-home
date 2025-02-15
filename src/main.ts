import 'virtual:uno.css'
import '@/assets/base.css'
import '@/assets/codeblocks.css'
import '@/assets/containers.css'

import { createSSRApp } from 'vue'
import App from './App.vue'
import { createRouter, RouterSymbol } from './router/router'
import ExpanderComponent from './components/ExpanderComponent.vue'

const pageModules = {
  ...import.meta.glob('../content/**/index.md'),
  ...import.meta.glob('../content/**/index.vue'),
}

export function createApp() {
  const app = createSSRApp(App)
  const router = createRouter()

  app.provide(RouterSymbol, router)
  app.provide('pageModules', pageModules)
  app.component('ExpanderComponent', ExpanderComponent)
  return { app, router }
}
