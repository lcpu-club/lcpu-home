// Adapted from vitepress 0.8.1

import { inject, reactive, type InjectionKey } from 'vue'

export interface Route {
  path: string
  scrollTop: number
}

export interface Router {
  route: Route
  go: (href?: string) => void
}

export const RouterSymbol: InjectionKey<Router> = Symbol()

const scrollHistory: Record<string, number> = {}
let getScrollTop: () => number | undefined

const getDefaultRoute = (): Route => ({
  path: '/',
  scrollTop: 0,
})

export function createRouter(): Router {
  const route = reactive(getDefaultRoute())
  const go = (href?: string) => {
    if (!href) href = import.meta.env.SSR ? '/' : window.location.href
    route.path = href
    route.scrollTop = scrollHistory[href] || 0
  }
  if (!import.meta.env.SSR) initListeners(go)
  return { route, go }
}

export function useRouter(provideScrollHeight: () => number | undefined): Router {
  getScrollTop = provideScrollHeight
  const router = inject(RouterSymbol)
  if (!router) {
    throw new Error('useRouter() is called without provider.')
  }
  return router
}

export function useRoute(provideScrollHeight: () => number | undefined): Route {
  return useRouter(provideScrollHeight).route
}

function initListeners(go: (href?: string) => void) {
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
        scrollHistory[currentUrl.href] = getScrollTop?.() ?? 0
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
