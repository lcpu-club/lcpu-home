import 'virtual:uno.css'
import '@/assets/base.css'
import '@/assets/codeblocks.css'
import '@/assets/containers.css'

import { createSSRApp, createApp as createSPAApp } from 'vue'
import App from './App.vue'
import { createRouter, RouterSymbol } from './router/router'
import allPages from 'virtual:pages.json'
import pageModules from 'virtual:page-modules'
import { RouteTitleRecord } from './site'
import { normalizePath } from './router/paths'
import ExpanderComponent from './components/ExpanderComponent.vue'
import ImageGallery from './components/ImageGallery'

const routes = new Set([
  '/',
  '/tags',
  '/404.html',
  ...Object.keys(RouteTitleRecord).map((category) => `/${category}`),
  ...allPages.map((page) => normalizePath(page.contentUrl)),
  ...Object.keys(pageModules)
    .filter((path) => path.endsWith('.vue'))
    .map((path) => normalizePath(path.replace('../content', '').replace('/index.vue', ''))),
])

export function createApp() {
  const app = import.meta.env.DEV ? createSPAApp(App) : createSSRApp(App)
  const router = createRouter((pathname) => routes.has(normalizePath(pathname)))

  app.provide(RouterSymbol, router)
  app.provide('pageModules', pageModules)
  app.component('ExpanderComponent', ExpanderComponent)
  app.component('ImageGallery', ImageGallery)
  return { app, router }
}
