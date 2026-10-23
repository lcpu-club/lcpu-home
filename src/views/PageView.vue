<script setup lang="ts">
import { useRoute, useRouter, useScrollRestoration } from '@/router/router'
import { normalizePath, getHash } from '@/router/paths'
import {
  computed,
  inject,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  shallowRef,
  useTemplateRef,
  watch,
  type Component,
} from 'vue'
import type { PageData } from '@/data/pagedata'
import allPages from 'virtual:pages.json'
import NotFoundView from '@/views/NotFoundView.vue'
import LoadErrorView from '@/views/LoadErrorView.vue'
import type { Module } from '@/module'
import { dateString, isIndexPage as testIndexPage, throttleAndDebounce } from '@/utils'
import PageListView from './PageListView.vue'
import SidebarComponent from '@/components/SidebarComponent.vue'
import TopbarComponent from '@/components/TopbarComponent.vue'
import LoadingView from './LoadingView.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import { SiteConfiguration } from '@/site'
import type { MarkdownItHeader } from '@mdit-vue/plugin-headers'
import PageOutline from '@/components/PageOutline.vue'
import TagsView from './TagsView.vue'
import TagList from '@/components/TagList.vue'
import { usePageMetadata } from '@/metadata'

const pageModules = inject('pageModules') as Record<string, () => Promise<Module>>
const route = useRoute()
const router = useRouter()
useScrollRestoration(() => document.scrollingElement?.scrollTop)
const pathname = computed(() => normalizePath(route.path))
const pageCategory = computed(() => getPageCategory(pathname.value))
const pageInfo = computed(() => getCurrentPage(pathname.value))
const currentPage = computed(() => pageInfo.value.page)
const isCurrentIndexPage = computed(() => pageInfo.value.isIndexPage)
const hasVuePage = computed(() => `../content${pathname.value}/index.vue` in pageModules)

usePageMetadata(
  () => ({
    titlePrefix:
      currentPage.value?.title ?? (hasVuePage.value ? pageCategory.value : '404 NOT FOUND'),
    meta: {
      ...currentPage.value?.meta,
      description:
        currentPage.value?.meta?.description ??
        currentPage.value?.excerpt ??
        (!hasVuePage.value ? '未找到此页面...' : undefined),
    },
    time: currentPage.value?.time ?? '',
    author: currentPage.value?.data.author ?? '',
    sourceUrl: currentPage.value?.sourceUrl ?? '',
    redirectUrl: currentPage.value?.redirect,
  }),
  () => route.path,
)

const showTitle = ref(false)
const documentWrapper = useTemplateRef('document-wrapper')
const sidebarRef = useTemplateRef('sidebar-ref')
const Content = shallowRef<Component>(LoadingView)
const pageOutlineData = ref<MarkdownItHeader[]>([])
const highlightedSlug = ref('')
let headerElements: Element[] = []
let navigationId = 0
let mounted = false

function scrollToRoute(path: string) {
  const anchor = document.getElementById(getHash(path))
  if (anchor) {
    window.scrollTo({
      top: anchor.getBoundingClientRect().top + window.scrollY - 64,
      behavior: 'instant',
    })
  } else {
    window.scrollTo({ top: route.scrollTop, behavior: 'instant' })
  }
  handleScroll()
}

async function loadPage(path: string) {
  const id = ++navigationId
  if (!import.meta.env.SSR && currentPage.value?.redirect) {
    window.location.replace(currentPage.value.redirect)
    return
  }
  handleScroll.cancel()
  headerElements = []
  highlightedSlug.value = ''
  pageOutlineData.value = []
  Content.value = LoadingView
  try {
    const module = await resolvePageModule(currentPage.value?.sourceUrl || normalizePath(path))
    if (id !== navigationId) return
    pageOutlineData.value = module.__headers ?? []
    Content.value = module.default
  } catch (error) {
    if (import.meta.env.SSR) throw error
    if (id !== navigationId) return
    console.error('Failed to load article', error)
    Content.value = LoadErrorView
  }
  await nextTick()
  if (mounted && id === navigationId) scrollToRoute(route.path)
}

watch(
  () => route.path,
  async (newPath, oldPath) => {
    if (normalizePath(newPath) === normalizePath(oldPath)) {
      await nextTick()
      if (mounted && Content.value !== LoadingView) scrollToRoute(newPath)
      return
    }
    await loadPage(newPath)
  },
)

onMounted(() => {
  router.activate()
  mounted = true
  if (currentPage.value?.redirect) return
  scrollToRoute(route.path)
  document.addEventListener('scroll', handleScroll, { passive: true })
})
onUnmounted(() => {
  mounted = false
  ++navigationId
  handleScroll.cancel()
  document.removeEventListener('scroll', handleScroll)
})

async function resolvePageModule(sourceOrPathname: string): Promise<Module> {
  const path = normalizePath(sourceOrPathname)
  const slugs = path.split('/').filter(Boolean)
  if (testIndexPage(slugs)) return { default: PageListView }
  if (path === '/tags') return { default: TagsView }
  const candidates = path.endsWith('.md')
    ? [`../content${path}`]
    : [`../content${path}/index.md`, `../content${path}/index.vue`]
  for (const candidate of candidates) {
    if (candidate in pageModules) return pageModules[candidate]()
  }
  return { default: NotFoundView }
}

const handleScroll = throttleAndDebounce(() => {
  const scrollTop = document.scrollingElement?.scrollTop ?? 0
  showTitle.value = scrollTop > 60
  if (!pageOutlineData.value.length || !documentWrapper.value) return
  if (!headerElements.length) {
    const slugs = new Set(pageOutlineData.value.map((header) => header.slug))
    headerElements = [...documentWrapper.value.querySelectorAll('h1, h2, h3, h4, h5, h6')].filter(
      (element) => slugs.has(element.id),
    )
  }
  let active = ''
  for (const element of headerElements) {
    if (element.getBoundingClientRect().top < 80) active = element.id
  }
  if (scrollTop + window.innerHeight >= (document.scrollingElement?.scrollHeight ?? Infinity) - 2) {
    active = pageOutlineData.value.at(-1)?.slug ?? active
  }
  highlightedSlug.value = active
}, 100)

function getCurrentPage(path: string): { page: PageData | undefined; isIndexPage: boolean } {
  const slugs = path.split('/').filter(Boolean)
  if (testIndexPage(slugs)) {
    const pages = allPages
      .filter((page) => page.category === slugs[0])
      .sort((a, b) => Date.parse(b.time) - Date.parse(a.time))
    return {
      page: {
        contentUrl: `/${slugs[0]}/`,
        title: SiteConfiguration.getRouteCategoryTitle(slugs[0]),
        time: !pages.length
          ? ''
          : pages.length > 1
            ? `${dateString(pages.at(-1)!.time)} - ${dateString(pages[0].time)}`
            : dateString(pages[0].time),
        data: {},
        sourceUrl: '',
      },
      isIndexPage: true,
    }
  }
  if (path === '/tags')
    return {
      page: { title: '标签', contentUrl: '/tags/', time: '', data: {}, sourceUrl: '' },
      isIndexPage: true,
    }
  return {
    page: allPages.find((page) => normalizePath(page.contentUrl) === path),
    isIndexPage: false,
  }
}

function getPageCategory(path: string): string {
  return SiteConfiguration.getRouteCategoryTitle(path.split('/')[1]) ?? 'LCPU'
}

await loadPage(route.path)
</script>

<template>
  <div lg:grid class="lg:grid-cols-[auto_1fr_auto]" overflow-auto>
    <SidebarComponent ref="sidebar-ref" :current-title="currentPage?.title" />
    <div overflow-auto box-border ref="document-wrapper">
      <div p-t-12 p-x-6 lg:p-x-12>
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
          <TagList :tags="currentPage.tags" v-if="currentPage.tags" m-t-4 />
        </div>
        <component :is="Content" max-w-800px m-x-auto />
        <FooterComponent p-y-12 max-w-800px m-x-auto />
      </div>
    </div>
    <PageOutline
      hidden
      xl:block
      v-if="pageOutlineData.length"
      :page-outline="pageOutlineData"
      :highlighted-slug="highlightedSlug"
    />
  </div>
</template>
