// Adapted from vitepress 0.8.1

import { inject, markRaw, reactive, type Component, type InjectionKey } from 'vue'

interface Module {
  default: Component
}

export interface Route {
  path: string
  mainComponent: Component | null
}

export interface Router {
  route: Route
  go: (href?: string) => Promise<void>
}

export const RouterSymbol: InjectionKey<Router> = Symbol()

const getDefaultRoute = (): Route => ({
  path: '/',
  mainComponent: null,
})

export function createRouter(): Router {
  const route = reactive(getDefaultRoute())
  const go = async (href?: string) => {
    if (!href) href = window.location.href
    let mainModule = getMainModule(href)
    if ('then' in mainModule && typeof mainModule.then === 'function') {
      mainModule = await mainModule
    }
    route.mainComponent = markRaw((mainModule as Module).default)
    // if (isMarkdownPage) {
    //   let module = getModule(href)
    //   if ('then' in module && typeof module.then === 'function') {
    //     module = await module
    //   }
    //   route.innerComponent = markRaw((module as Module).default)
    // }
    route.path = href
  }
  initListeners(go)
  return { route, go }
}

export function useRouter(): Router {
  const router = inject(RouterSymbol)
  if (!router) {
    throw new Error('useRouter() is called without provider.')
  }
  return router
}

export function useRoute(): Route {
  return useRouter().route
}

// function getModule(href: string): Module | Promise<Module> {
//   const url = new URL(href, 'http://a.com/')
//   const path = url.pathname
//   if (import.meta.env.DEV) {
//     const filePath = '../data' + path + '.md'
//     console.log(filePath)
//     return import(/* @vite-ignore */ filePath)
//   } else {
//     const segs = path.split('/')
//     const filePath = './data' + path + '.md'
//     console.log(filePath)
//     if (segs[1] === 'activities') {
//       return activityModuels[filePath]() as Promise<Module>
//     }
//     if (segs[1] === 'news') {
//       return newsModules[filePath]() as Promise<Module>
//     }
//   }
//   return import('@/views/NotFoundView.vue')
// }

function initListeners(go: (href?: string) => Promise<void>) {
  window.addEventListener(
    'click',
    (e) => {
      const link = (e.target as Element).closest('a')
      if (!link) return
      const { protocol, hostname, target } = link
      const currentUrl = window.location
      if (
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.altKey &&
        !e.metaKey &&
        target !== `_blank` &&
        protocol === currentUrl.protocol &&
        hostname === currentUrl.hostname
      ) {
        e.preventDefault()
        history.pushState(null, '', link.href)
        go(link.href)
      }
    },
    { capture: true },
  )
  window.addEventListener('popstate', () => {
    go(location.href)
  })
}

function getMainModule(href: string): Module | Promise<Module> {
  const url = new URL(href, 'http://a.com/')
  const path = url.pathname
  if (path === '/') return import('@/views/HomeView.vue')
  const segs = path.split('/')
  if (segs[1] === 'activities') return import('@/views/ActivityView.vue')
  if (segs[1] === 'news') return import('@/views/NewsView.vue')
  return import('@/views/NotFoundView.vue')
}
