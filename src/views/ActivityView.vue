<script setup lang="ts">
import { useRoute } from '@/router/router'
import {
  defineAsyncComponent,
  inject,
  onMounted,
  ref,
  shallowRef,
  useSSRContext,
  useTemplateRef,
  watch,
} from 'vue'
import rawActivityList from 'virtual:activity-list.json'
import type { Activity } from '@/data/activity'
import NotFoundView from '@/views/NotFoundView.vue'
import type { Module } from '@/module'
import { useTitle } from '@vueuse/core'
import { dateString } from '@/utils'
import ActivityListView from './ActivityListView.vue'
import SidebarComponent from '@/components/SidebarComponent.vue'
import TopbarComponent from '@/components/TopbarComponent.vue'
import LoadingView from './LoadingView.vue'
import type { SSRContext } from 'vue/server-renderer'

const route = useRoute(() => scrollViewRef?.value?.scrollTop)
const activityList: Activity[] = rawActivityList
const activityModules = inject('activityModules') as Record<string, () => Promise<unknown>>
const title = useTitle('', { titleTemplate: '%s活动 - 北京大学学生 Linux 俱乐部' })
const scrollViewRef = ref<HTMLDivElement>()
const showTitle = ref(false)
const sidebarRef = useTemplateRef('sidebar-ref')
let ssrContext: SSRContext | undefined
if (import.meta.env.SSR) ssrContext = useSSRContext()

const pathname = getPathname(route.path)
const currentActivity = shallowRef(getCurrentActivity(pathname))
title.value = currentActivity.value?.title ? currentActivity.value.title + ' | ' : ''
if (ssrContext) ssrContext.titlePrefix = title.value + '活动 - '
const Content = shallowRef(defineAsyncComponent(() => resolvePageModule(pathname)))

watch(
  () => route.path,
  async (newVal) => {
    const pathname = getPathname(newVal)
    currentActivity.value = getCurrentActivity(pathname)
    Content.value = LoadingView as never
    const module = await resolvePageModule(pathname)
    if ('default' in module) Content.value = module.default
    else Content.value = module
    scrollViewRef.value?.scrollTo({ top: 0, behavior: 'instant' })
  },
)

onMounted(() => {
  scrollViewRef.value?.scrollTo({ top: 0, behavior: 'instant' })
})

// let's also update page title since we have access to the pathname property.
async function resolvePageModule(pathname: string): Promise<Module | never> {
  const modulePath = './data' + pathname + '.md'
  return new Promise(async (resolve) => {
    if (
      pathname === '/activities/' ||
      pathname === '/activities/index' ||
      pathname === '/activities/index.html'
    )
      resolve(ActivityListView as never)
    else if (modulePath in activityModules) {
      let module: Promise<Module> | Module = activityModules[modulePath]() as
        | Promise<Module>
        | Module
      if ('then' in module && typeof module.then === 'function') module = await module
      resolve(module)
    } else resolve(NotFoundView as never)
  })
}

function handleScroll() {
  const scrollTop = scrollViewRef.value?.scrollTop
  if (scrollTop == undefined) return
  if (scrollTop > 60) {
    showTitle.value = true
  } else {
    showTitle.value = false
  }
}

function getPathname(path: string) {
  return new URL(path, 'http://a.com').pathname
}

function getCurrentActivity(pathname: string): Activity | undefined {
  return activityList.find((activity) => activity.contentUrl === pathname) || undefined
}
</script>

<template>
  <div lg:grid lg:grid-cols-4 h-screen class="h-100dvh!" overflow-auto>
    <SidebarComponent ref="sidebar-ref" :current-title="currentActivity?.title" />

    <div
      lg:col-span-3
      p-y-12
      p-x-6
      lg:p-x-12
      overflow-auto
      h-screen
      class="h-100dvh!"
      box-border
      ref="scrollViewRef"
      @scroll="handleScroll"
    >
      <TopbarComponent
        :toggleSidebarFn="sidebarRef?.toggleSidebar"
        :title="currentActivity?.title ?? '活动'"
        :show-title="showTitle"
      />
      <div v-if="currentActivity" m-b-8 max-w-800px m-x-auto m-t-4 lg:m-t-0>
        <h1 m-0>{{ currentActivity.title }}</h1>
        <span text-gray-500 block m-t-2 dark:text-gray-300>{{
          dateString(currentActivity.time)
        }}</span>
      </div>
      <Transition mode="out-in">
        <component :is="Content" max-w-800px m-x-auto />
      </Transition>
    </div>
  </div>
</template>

<style lang="css" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.4s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
