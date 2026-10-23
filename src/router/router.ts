import { inject, onUnmounted, reactive, type InjectionKey } from 'vue'

export interface Route {
  path: string
  scrollTop: number
}

export interface Router {
  route: Route
  go: (href?: string) => void
  activate: () => void
  registerScrollProvider: (provider: () => number | undefined) => () => void
}

export const RouterSymbol: InjectionKey<Router> = Symbol()

export function createRouter(isAppRoute: (pathname: string) => boolean = () => false): Router {
  const route = reactive<Route>({ path: '/', scrollTop: 0 })
  const scrollHistory = new Map<string, number>()
  let active = false
  let scrollProvider: (() => number | undefined) | undefined
  const go = (href?: string) => {
    const next = href ?? (import.meta.env.SSR ? '/' : window.location.href)
    // Save the departing entry before popstate changes our reactive route.
    scrollHistory.set(route.path, scrollProvider?.() ?? 0)
    route.scrollTop = scrollHistory.get(next) ?? 0
    route.path = next
  }
  const registerScrollProvider = (provider: () => number | undefined) => {
    scrollProvider = provider
    return () => {
      if (scrollProvider === provider) scrollProvider = undefined
    }
  }
  if (!import.meta.env.SSR) {
    history.scrollRestoration = 'manual'
    window.addEventListener(
      'click',
      (event) => {
        if (
          !active ||
          event.defaultPrevented ||
          event.button !== 0 ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          event.metaKey
        )
          return
        const target = event.target
        if (!(target instanceof Element)) return
        const link = target.closest('a')
        if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self'))
          return
        const url = new URL(link.href)
        if (url.origin !== location.origin || !isAppRoute(url.pathname)) return
        event.preventDefault()
        if (url.href === location.href) return
        history.pushState(null, '', url.href)
        go(url.href)
      },
      { capture: true },
    )
    window.addEventListener('popstate', () => {
      if (active) go(location.href)
    })
  }
  const activate = () => {
    if (import.meta.env.SSR) return
    active = true
    const container = document.getElementById('app')
    if (container) container.dataset.hydrated = 'true'
    if (route.path !== location.href) go(location.href)
  }
  return { route, go, registerScrollProvider, activate }
}

export function useRouter(): Router {
  const router = inject(RouterSymbol)
  if (!router) throw new Error('useRouter() is called without provider.')
  return router
}

export function useRoute(): Route {
  return useRouter().route
}

export function useScrollRestoration(provider: () => number | undefined) {
  const unregister = useRouter().registerScrollProvider(provider)
  onUnmounted(unregister)
}
