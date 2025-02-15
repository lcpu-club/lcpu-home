<script setup lang="ts">
import ItemCard from '@/components/ItemCard.vue'
import rawProjectData from '@/data/projects.json'
import rawEventData from '@/data/events.json'
import allPages from 'virtual:pages.json'
import type { Project } from '@/data/project'
import type { Event } from '@/data/event'
import PageListEntry from '@/components/PageListEntry.vue'
import AutoDarkImage from '@/components/AutoDarkImage.vue'

import LcpuDark from '../assets/lcpu-dark.svg?no-inline'
import LcpuLight from '../assets/lcpu-light.svg?no-inline'
import GithubMark from '../assets/github-mark.svg?no-inline'
import GithubMarkWhite from '../assets/github-mark-white.svg?no-inline'
import BilibiliIcon from '../assets/bilibili.svg?no-inline'
import BilibiliIconWhite from '../assets/bilibili-white.svg?no-inline'
import { ChevronRightIcon, EnvelopeIcon } from '@heroicons/vue/24/solid'
import { useTitle } from '@vueuse/core'
import { useRoute } from '@/router/router'
import { onMounted, useSSRContext, useTemplateRef, ref } from 'vue'
import FooterComponent from '@/components/FooterComponent.vue'
import { SiteConfiguration, RouteTitleRecord } from '@/site'
import type { PageData } from '@/data/pagedata'

const projects = rawProjectData as Project[]
const events = rawEventData as Event[]
const eventItems = events.map((event) => {
  return { ...event, startDate: new Date(event.startDate), endDate: new Date(event.endDate) }
})
const categories: { title: string; route: string; pages: PageData[] }[] = []

Object.keys(RouteTitleRecord).forEach((category) => {
  categories.push({
    title: SiteConfiguration.getRouteCategoryTitle(category),
    route: `/${category}/`,
    pages: allPages
      .filter((page) => page.category === category)
      .sort((a, b) => Date.parse(b.time) - Date.parse(a.time)),
  })
})

const scrollViewRef = useTemplateRef('scrollViewRef')
const mobileScrollViewRef = useTemplateRef('mobileScrollViewRef')
const route = useRoute(() =>
  Math.max(scrollViewRef.value?.scrollTop ?? 0, mobileScrollViewRef.value?.scrollTop ?? 0),
)
useTitle('北京大学学生 Linux 俱乐部')

const colorClasses = {
  red: 'text-red-400 border-red-400',
  green: 'text-green-400 border-green-400',
  gray: 'text-gray-400 border-gray-400',
}

const pkuNetwork = ref(true)
const nowDate = ref(new Date())

onMounted(() => {
  scrollViewRef.value?.scrollTo({ top: route.scrollTop, behavior: 'instant' })
  mobileScrollViewRef.value?.scrollTo({ top: route.scrollTop, behavior: 'instant' })
  fetch('https://api.lcpu.dev/generate_204', {
    mode: 'no-cors',
    signal: AbortSignal.timeout(1000),
  })
    .then(() => {})
    .catch(() => {
      pkuNetwork.value = false
    })

  nowDate.value = new Date()
})

if (import.meta.env.SSR) {
  const ctx = useSSRContext()
  if (ctx) {
    if (!ctx.meta) {
      ctx.meta = {}
    }
    ctx.meta.description =
      '北京大学学生 Linux 俱乐部(Linux Club of Peking University, LCPU)是由学生自发成立的民间组织，以学习研究 Linux 操作系统和其它各种与开源相关的软硬件技术为目的。'
    ctx.meta.keywords = [
      'lcpu',
      'linux',
      'open-source',
      'pku',
      '开源',
      '北京大学',
      'hpcgame',
      'geekgame',
      'clab',
    ]
  }
}
</script>

<template>
  <main p-l-6 lg:p-l-12>
    <div
      w-full
      h-screen
      box-border
      class="h-100dvh!"
      sm:grid
      sm:grid-cols-2
      lg:grid-cols-3
      max-w-1680px
      m-x-auto
      gap-6
      lg:gap-12
      overflow-auto
      ref="mobileScrollViewRef"
    >
      <div flex="~ items-center justify-center col" m-t-24 box-border sm:m-t-0 p-r-6 sm:p-r-0>
        <AutoDarkImage h-48 :src="LcpuDark" :src-dark="LcpuLight" alt="LCPU 标识" />
        <h1 m-t-8 m-b-0 text-center>北京大学<br />学生 Linux 俱乐部</h1>
        <span m-t-1 text-lg>Linux Club of Peking University</span>
        <div flex="~ items-center gap-6" m-t-8>
          <a href="https://github.com/lcpu-club" h-7>
            <AutoDarkImage :src="GithubMark" :src-dark="GithubMarkWhite" h-full alt="Github 标识" />
          </a>
          <a href="https://space.bilibili.com/3461562830424779" h-7>
            <AutoDarkImage
              :src="BilibiliIcon"
              :src-dark="BilibiliIconWhite"
              h-full
              alt="Bilibili 标识"
            />
          </a>
          <a href="mailto:linuxclub@pku.edu.cn" h-7 dark:text-white text-black>
            <EnvelopeIcon class="h-7" />
          </a>
        </div>
      </div>
      <div lg:col-span-2 overflow-auto p-y-12 p-r-6 lg:p-r-12 ref="scrollViewRef">
        <h2>项目</h2>
        <div grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2>
          <ItemCard
            v-for="item in projects"
            :key="item.title"
            :item="item"
            :tag="item.internal && !pkuNetwork ? '仅校园网' : ''"
            :tagClass="colorClasses['red']"
          />
        </div>

        <h2>活动</h2>
        <div grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2>
          <ItemCard
            v-for="item in eventItems"
            :key="item.title"
            :item="item"
            :tag="
              nowDate < item.startDate ? '未开始' : nowDate < item.endDate ? '进行中' : '已结束'
            "
            :tagClass="
              nowDate < item.startDate
                ? colorClasses['gray']
                : nowDate < item.endDate
                  ? colorClasses['green']
                  : colorClasses['red']
            "
          />
        </div>

        <div m-t-8 v-for="category in categories" :key="category.title">
          <div flex="~ items-center">
            <h2 m-0 flex-grow-1>{{ category.title }}</h2>
            <a
              class="text-unset! hover:bg-gray/10 p-l-2 p-y-1 rounded-md"
              decoration-none
              flex="~ items-center"
              :href="category.route"
            >
              <span>所有{{ category.title }}</span>
              <ChevronRightIcon class="h-5" />
            </a>
          </div>

          <div m-t-4>
            <PageListEntry
              v-for="page in category.pages.slice(0, 3)"
              :key="page.title"
              :page-entry="page"
            />
          </div>
        </div>
        <FooterComponent m-t-12 />
      </div>
    </div>
  </main>
</template>

<style lang="css" scoped></style>
