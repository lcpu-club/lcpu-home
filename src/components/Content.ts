import { useRoute } from '@/router/router'
import { h, type Component } from 'vue'

export const Content: Component = {
  setup() {
    const route = useRoute()
    return () => (route.mainComponent ? h(route.mainComponent) : null)
  },
}
