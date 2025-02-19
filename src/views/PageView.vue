<script setup lang="ts">
import { useRoute } from '@/router/router'
import { inject, onMounted, ref, shallowRef, useSSRContext, useTemplateRef, watch } from 'vue'
import type { PageData } from '@/data/pagedata'
import allPages from 'virtual:pages.json'
import NotFoundView from '@/views/NotFoundView.vue'
import type { Module } from '@/module'
import { useTitle } from '@vueuse/core'
import { dateString, isIndexPage as testIndexPage, throttleAndDebounce } from '@/utils'
import PageListView from './PageListView.vue'
import SidebarComponent from '@/components/SidebarComponent.vue'
import TopbarComponent from '@/components/TopbarComponent.vue'
import LoadingView from './LoadingView.vue'
import type { SSRContext } from 'vue/server-renderer'
import FooterComponent from '@/components/FooterComponent.vue'
import { SiteConfiguration } from '@/site'
import type { MarkdownItHeader } from '@mdit-vue/plugin-headers'
import PageOutline from '@/components/PageOutline.vue'

let ssrContext: SSRContext | undefined
if (import.meta.env.SSR) ssrContext = useSSRContext()

const pageModules = inject('pageModules') as Record<string, () => Promise<unknown>>
const route = useRoute(() => scrollViewRef.value?.scrollTop)
const pathname = getPathname(route.path)
const pageCategory = ref(getPageCategory(pathname))
const { page, isIndexPage } = getCurrentPage(pathname)
const currentPage = shallowRef(page)
const isCurrentIndexPage = ref(isIndexPage)
const title = useTitle('', { titleTemplate: `%s | ${SiteConfiguration.titleSuffix}` })

title.value = currentPage.value?.title ? currentPage.value.title : pageCategory.value
if (ssrContext) {
  ssrContext.titlePrefix = title.value
  const meta: { [key: string]: string } = currentPage.value?.meta ?? {}
  meta.description = (meta.description ?? currentPage.value?.excerpt)?.trim()
  ssrContext.meta = meta
  ssrContext.time = currentPage.value?.time ?? ''
  ssrContext.author = currentPage.value?.data?.author ?? ''
  ssrContext.sourceUrl = currentPage.value?.sourceUrl ?? ''
}
const scrollViewRef = ref<HTMLDivElement>()
const showTitle = ref(false)
const sidebarRef = useTemplateRef('sidebar-ref')
const module = await resolvePageModule(currentPage.value?.sourceUrl || pathname)
const Content = shallowRef(module.default ?? module)
const pageOutlineData = ref<MarkdownItHeader[]>(module.__headers ?? [])
const highlightedSlug = ref('')
let headerElements: Element[] = []
let headerElementsOutdated = true

watch(
  () => route.path,
  async (newVal, oldVal) => {
    const pathname = getPathname(newVal)
    const oldPathname = getPathname(oldVal)
    if (pathname === oldPathname) {
      const anchor = document.getElementById(getHash(newVal).substring(1))
      if (anchor) scrollViewRef.value?.scrollTo({ top: anchor.offsetTop - 40, behavior: 'smooth' })
      return
    }
    const { page, isIndexPage } = getCurrentPage(pathname)
    currentPage.value = page
    isCurrentIndexPage.value = isIndexPage
    title.value = currentPage.value?.title ? currentPage.value.title : pageCategory.value
    Content.value = LoadingView as never
    pageOutlineData.value = []
    const module = await resolvePageModule(currentPage.value?.sourceUrl || pathname)
    pageOutlineData.value = module.__headers ?? []
    Content.value = module.default ?? module
    headerElementsOutdated = true
    scrollViewRef.value?.scrollTo({ top: route.scrollTop, behavior: 'instant' })
  },
)

onMounted(() => {
  const anchor = document.getElementById(getHash(route.path).substring(1))
  if (anchor) scrollViewRef.value?.scrollTo({ top: anchor.offsetTop - 40, behavior: 'smooth' })
  else scrollViewRef.value?.scrollTo({ top: route.scrollTop, behavior: 'instant' })
})

async function resolvePageModule(sourceOrPathname: string): Promise<Module | never> {
  const urlSlugs = sourceOrPathname.split('/').filter((slug) => slug)
  const indexPage = testIndexPage(urlSlugs)
  if (indexPage) {
    return PageListView as never
  }
  if (sourceOrPathname.endsWith('/')) sourceOrPathname = sourceOrPathname.slice(0, -1)
  const modulePathCandidates = sourceOrPathname.endsWith('.md')
    ? ['../content' + sourceOrPathname]
    : [
        '../content' + sourceOrPathname + '.md',
        '../content' + sourceOrPathname + '/index.md',
        '../content' + sourceOrPathname + '.vue',
        '../content' + sourceOrPathname + '/index.vue',
      ]
  for (const modulePath of modulePathCandidates) {
    if (modulePath in pageModules) {
      const module = await (pageModules[modulePath]() as Promise<Module> | Module)
      return module
    }
  }
  return NotFoundView as never
}

const handleScroll = throttleAndDebounce(() => {
  const scrollTop = scrollViewRef.value?.scrollTop
  if (scrollTop == undefined) return
  if (scrollTop > 60) {
    showTitle.value = true
  } else {
    showTitle.value = false
  }
  if (!pageOutlineData.value.length) return
  if (!scrollViewRef.value) return
  if (headerElementsOutdated) {
    headerElements = [
      ...(scrollViewRef.value?.querySelectorAll('h1, h2, h3, h4, h5, h6') ?? []),
    ].filter((x) => pageOutlineData.value.some((y) => y.slug == x.id))
    headerElementsOutdated = false
  }
  const elements = headerElements
    .map((x) => {
      return {
        slug: x.id,
        top: x.getBoundingClientRect().top,
      }
    })
    .filter((x) => x.top < 80)
    .sort((a, b) => b.top - a.top)
  highlightedSlug.value = elements[0]?.slug ?? ''
  // if scrolled to bottom, highlight the last item
  if (
    Math.abs(
      scrollViewRef.value.scrollTop +
        scrollViewRef.value.clientHeight -
        scrollViewRef.value.scrollHeight,
    ) < 1
  ) {
    highlightedSlug.value = pageOutlineData.value.slice(-1)[0].slug
  }
}, 100)

function getPathname(path: string) {
  return new URL(path, 'http://a.com').pathname
}

function getHash(path: string) {
  return new URL(path, 'http://a.com').hash
}

function getCurrentPage(pathname: string): { page: PageData | undefined; isIndexPage: boolean } {
  const urlSlugs = pathname.split('/').filter((slug) => slug)
  const indexPage = testIndexPage(urlSlugs)
  if (indexPage) {
    const pages =
      allPages
        .filter((page) => page.category === urlSlugs[0])
        .sort((a, b) => Date.parse(b.time) - Date.parse(a.time)) ?? []
    const first = pages[0]
    const last = pages[pages.length - 1]
    return {
      page: {
        contentUrl: '',
        title: SiteConfiguration.getRouteCategoryTitle(urlSlugs[0]),
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
    page: allPages.find((page) => page.contentUrl === pathname) || undefined,
    isIndexPage: false,
  }
}

function getPageCategory(pathname: string): string {
  const pageSegs = pathname.split('/')
  return SiteConfiguration.getRouteCategoryTitle(pageSegs[1]) ?? pageSegs[1]
}
</script>

<template>
  <div lg:grid lg:grid-cols-4 h-screen class="h-100dvh!" overflow-auto>
    <SidebarComponent ref="sidebar-ref" :current-title="currentPage?.title" />
    <div
      lg:col-span-3
      lg:flex
      overflow-auto
      h-screen
      class="h-100dvh!"
      box-border
      ref="scrollViewRef"
      @scroll.passive="handleScroll"
    >
      <div flex-1 p-t-12 p-x-6 lg:p-x-12>
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
          <component v-on:mounted="console.log(1)" :is="Content" max-w-800px m-x-auto />
        </Transition>
        <FooterComponent p-y-12 max-w-800px m-x-auto />
      </div>
      <PageOutline
        hidden
        xl:block
        :page-outline="pageOutlineData"
        :highlighted-slug="highlightedSlug"
      />
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
