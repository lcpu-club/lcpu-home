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
import type { PageData } from '@/data/pagedata'
import categoryList from 'virtual:category-list.json'
import NotFoundView from '@/views/NotFoundView.vue'
import type { Module } from '@/module'
import { useTitle } from '@vueuse/core'
import { dateString, indexPageRe } from '@/utils'
import PageListView from './PageListView.vue'
import SidebarComponent from '@/components/SidebarComponent.vue'
import TopbarComponent from '@/components/TopbarComponent.vue'
import LoadingView from './LoadingView.vue'
import type { SSRContext } from 'vue/server-renderer'
import FooterComponent from '@/components/FooterComponent.vue'
import { SiteConfiguration } from '@/site'

let ssrContext: SSRContext | undefined
if (import.meta.env.SSR) ssrContext = useSSRContext()

const pageModules = inject('pageModules') as Record<string, () => Promise<unknown>>
const allPages = categoryList.flatMap((list) => list.pages)
const route = useRoute(() => scrollViewRef.value?.scrollTop)
const pathname = getPathname(route.path)
const pageCategory = ref(getPageCategory(pathname))
const { page, isIndexPage } = getCurrentPage(pathname)
const currentPage = shallowRef(page)
const isCurrentIndexPage = ref(isIndexPage)
const title = useTitle('', { titleTemplate: `%s${SiteConfiguration.titleSuffix}` })
title.value = currentPage.value?.title
  ? currentPage.value.title + ` | ${pageCategory.value} - `
  : `${pageCategory.value} - `
if (ssrContext) {
  ssrContext.titlePrefix = title.value
  const meta: { [key: string]: string } = currentPage.value?.meta ?? {}
  meta.description = (meta.description ?? currentPage.value?.excerpt)?.trim()
  ssrContext.meta = meta
}
const scrollViewRef = ref<HTMLDivElement>()
const showTitle = ref(false)
const sidebarRef = useTemplateRef('sidebar-ref')

const Content = shallowRef(
  defineAsyncComponent(() => resolvePageModule(currentPage.value?.sourceUrl || pathname)),
)

watch(
  () => route.path,
  async (newVal, oldVal) => {
    const pathname = getPathname(newVal)
    const oldPathname = getPathname(oldVal)
    if (pathname === oldPathname) {
      const anchor = document.getElementById(getHash(newVal).substring(1))
      if (anchor) anchor.scrollIntoView({ behavior: 'smooth' })
      return
    }
    const { page, isIndexPage } = getCurrentPage(pathname)
    currentPage.value = page
    isCurrentIndexPage.value = isIndexPage
    title.value = currentPage.value?.title
      ? currentPage.value.title + ` | ${pageCategory.value} - `
      : `${pageCategory.value} - `
    Content.value = LoadingView as never
    const module = await resolvePageModule(currentPage.value?.sourceUrl || pathname)
    if ('default' in module) Content.value = module.default
    else Content.value = module
    scrollViewRef.value?.scrollTo({ top: route.scrollTop, behavior: 'instant' })
  },
)

onMounted(() => {
  const anchor = document.getElementById(getHash(route.path).substring(1))
  if (anchor) anchor.scrollIntoView({ behavior: 'smooth' })
  else scrollViewRef.value?.scrollTo({ top: route.scrollTop, behavior: 'instant' })
})

async function resolvePageModule(sourceOrPathname: string): Promise<Module | never> {
  if (sourceOrPathname.match(indexPageRe)) {
    return PageListView as never
  }
  if (sourceOrPathname.endsWith('/')) sourceOrPathname = sourceOrPathname.slice(0, -1)
  const modulePath = '../content' + sourceOrPathname
  if (modulePath in pageModules) {
    let module: Promise<Module> | Module = pageModules[modulePath]() as Promise<Module> | Module
    if ('then' in module && typeof module.then === 'function') module = await module
    return module
  } else return NotFoundView as never
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

function getHash(path: string) {
  return new URL(path, 'http://a.com').hash
}

function getCurrentPage(pathname: string): { page: PageData | undefined; isIndexPage: boolean } {
  const match = pathname.match(indexPageRe)
  if (match) {
    const pages = categoryList.find((list) => list.routeBase === match[1])?.pages ?? []
    const first = pages[0]
    const last = pages[pages.length - 1]
    return {
      page: {
        contentUrl: '',
        title: SiteConfiguration.getRouteCategoryTitle(match[1]),
        time:
          pages.length == 0
            ? ''
            : pages.length > 1
              ? `${dateString(last.time)} - ${dateString(first.time)}`
              : dateString(first.time),
        data: {},
        sourceUrl: '',
      },
      isIndexPage: true,
    }
  }

  return {
    page: allPages.find((news) => news.contentUrl === pathname) || undefined,
    isIndexPage: false,
  }
}

function getPageCategory(pathname: string): string {
  const pageSegs = pathname.split('/')
  return SiteConfiguration.getRouteCategoryTitle(pageSegs[1])
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
        <div flex="~ items-center gap-1" m-t-2 text-gray-500 dark:text-truegray-400>
          <span v-if="!isCurrentIndexPage">{{ dateString(currentPage.time) }}</span>
          <span v-else>{{ currentPage.time }}</span>
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
