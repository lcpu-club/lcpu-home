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
import rawNewsList from 'virtual:news-list.json'
import rawActivityList from 'virtual:activity-list.json'
import type { PageData } from '@/data/pagedata'
import NotFoundView from '@/views/NotFoundView.vue'
import type { Module } from '@/module'
import { useTitle } from '@vueuse/core'
import { dateString } from '@/utils'
import NewsListView from './NewsListView.vue'
import ActivityListView from './ActivityListView.vue'
import SidebarComponent from '@/components/SidebarComponent.vue'
import TopbarComponent from '@/components/TopbarComponent.vue'
import LoadingView from './LoadingView.vue'
import type { SSRContext } from 'vue/server-renderer'
import FooterComponent from '@/components/FooterComponent.vue'
import { SiteConfiguration } from '@/site'

let ssrContext: SSRContext | undefined
if (import.meta.env.SSR) ssrContext = useSSRContext()

const newsList: PageData[] = rawNewsList
const pageModules = inject('pageModules') as Record<string, () => Promise<unknown>>
const activityList: PageData[] = rawActivityList
const allPages = [...newsList, ...activityList]
const route = useRoute(() => scrollViewRef.value?.scrollTop)
const pathname = getPathname(route.path)
const pageCategory = ref(getPageCategory(pathname))
const currentPage = shallowRef(getCurrentPage(pathname))
const title = useTitle('', { titleTemplate: '%s北京大学学生 Linux 俱乐部' })
title.value = currentPage.value?.title
  ? currentPage.value.title + ` | ${pageCategory.value} - `
  : `${pageCategory.value} - `
if (ssrContext) {
  ssrContext.titlePrefix = title.value
  ssrContext.metaDescription = (
    (currentPage.value?.metaDescription as string | undefined)
      ? (currentPage.value?.metaDescription as string)
      : currentPage.value?.excerpt
        ? currentPage.value.excerpt
        : (currentPage.value?.title ?? '北京大学学生 Linux 俱乐部')
  ).trim()
}
const scrollViewRef = ref<HTMLDivElement>()
const showTitle = ref(false)
const sidebarRef = useTemplateRef('sidebar-ref')

const Content = shallowRef(defineAsyncComponent(() => resolvePageModule(pathname)))

watch(
  () => route.path,
  async (newVal) => {
    const pathname = getPathname(newVal)
    pageCategory.value = getPageCategory(pathname)
    currentPage.value = getCurrentPage(pathname)
    title.value = currentPage.value?.title
      ? currentPage.value.title + ` | ${pageCategory.value} - `
      : `${pageCategory.value} - `
    Content.value = LoadingView as never
    const module = await resolvePageModule(pathname)
    if ('default' in module) Content.value = module.default
    else Content.value = module
    scrollViewRef.value?.scrollTo({ top: route.scrollTop, behavior: 'instant' })
  },
)

onMounted(() => {
  scrollViewRef.value?.scrollTo({ top: route.scrollTop, behavior: 'instant' })
})

async function resolvePageModule(pathname: string): Promise<Module | never> {
  const modulePath = './data' + pathname + '.md'
  return new Promise(async (resolve) => {
    if (pathname === '/news/' || pathname === '/news/index' || pathname === '/news/index.html')
      resolve(NewsListView as never)
    else if (
      pathname === '/activities/' ||
      pathname === '/activities/index' ||
      pathname === '/activities/index.html'
    )
      resolve(ActivityListView as never)
    else if (modulePath in pageModules) {
      let module: Promise<Module> | Module = pageModules[modulePath]() as Promise<Module> | Module
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

function getCurrentPage(pathname: string): PageData | undefined {
  return allPages.find((news) => news.contentUrl === pathname) || undefined
}

function getPageCategory(pathname: string): string {
  const pageSegs = pathname.split('/')
  return SiteConfiguration.routeTitleRecord[pageSegs[1]] ?? '未知'
}
</script>

<template>
  <div lg:grid lg:grid-cols-4 h-screen class="h-100dvh!" overflow-auto>
    <SidebarComponent ref="sidebar-ref" :current-title="currentPage?.title" />
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
      @scroll.passive="handleScroll"
    >
      <TopbarComponent
        :toggleSidebarFn="sidebarRef?.toggleSidebar"
        :title="currentPage?.title ?? pageCategory"
        :show-title="showTitle"
      />
      <div v-if="currentPage" m-b-8 max-w-800px m-x-auto m-t-4 lg:m-t-0>
        <h1 m-0>{{ currentPage.title }}</h1>
        <div flex="~ items-center gap-1" m-t-2 text-gray-500 dark:text-gray-300>
          <span>{{ dateString(currentPage.time) }}</span>
          <span flex="~ gap-1" v-for="key in Object.keys(currentPage.data)" :key="key">
            <span>·</span>
            <span v-if="currentPage.data[key]">{{ currentPage.data[key] }}</span>
          </span>
        </div>
      </div>
      <Transition mode="out-in">
        <component :is="Content" max-w-800px m-x-auto />
      </Transition>
      <FooterComponent m-t-12 max-w-800px m-x-auto />
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
