<script setup lang="ts">
import { useRoute } from '@/router/router'
import { computed, defineAsyncComponent } from 'vue'
const route = useRoute(() => undefined)

const HomeView = defineAsyncComponent(() => import('@/views/HomeView.vue'))
const PageView = defineAsyncComponent(() => import('@/views/PageView.vue'))

const component = computed(() => {
  const url = new URL(route.path, 'http://example.com')
  if (url.pathname === '/' || url.pathname === '/index' || url.pathname === '/index.html') {
    return HomeView
  } else {
    return PageView
  }
})
</script>

<template>
  <component :is="component" />
</template>
