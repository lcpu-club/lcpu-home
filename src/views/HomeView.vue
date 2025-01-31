<script setup lang="ts">
import ProjectCard from '@/components/ProjectCard.vue'
import rawProjectData from '@/data/projects.json'
import categoryList from 'virtual:category-list.json'
import type { Project } from '@/data/project'
import PageListEntry from '@/components/PageListEntry.vue'
import AutoDarkImage from '@/components/AutoDarkImage.vue'

import LcpuDark from '../assets/lcpu-dark.svg'
import LcpuLight from '../assets/lcpu-light.svg'
import GithubMark from '../assets/github-mark.svg'
import GithubMarkWhite from '../assets/github-mark-white.svg'
import { ChevronRightIcon } from '@heroicons/vue/24/solid'
import { useTitle } from '@vueuse/core'
import { useRoute } from '@/router/router'
import { onMounted, useSSRContext, useTemplateRef } from 'vue'
import FooterComponent from '@/components/FooterComponent.vue'
import { SiteConfiguration } from '@/site'

const projects = rawProjectData as Project[]
const categories = categoryList.map((list) => {
  return {
    title: SiteConfiguration.getRouteCategoryTitle(list.routeBase),
    route: `/${list.routeBase}/`,
    pages: list.pages,
  }
})
const scrollViewRef = useTemplateRef('scrollViewRef')
const mobileScrollViewRef = useTemplateRef('mobileScrollViewRef')
const route = useRoute(() =>
  Math.max(scrollViewRef.value?.scrollTop ?? 0, mobileScrollViewRef.value?.scrollTop ?? 0),
)
useTitle('北京大学学生 Linux 俱乐部')

onMounted(() => {
  scrollViewRef.value?.scrollTo({ top: route.scrollTop, behavior: 'instant' })
  mobileScrollViewRef.value?.scrollTo({ top: route.scrollTop, behavior: 'instant' })
})

if (import.meta.env.SSR) {
  const ctx = useSSRContext()
  if (ctx) {
    if (!ctx.meta) {
      ctx.meta = {}
    }
    ctx.meta.description =
      '北京大学学生 Linux 俱乐部是由学生自发成立的民间组织，以学习研究 Linux 操作系统和其它各种与开源相关的软硬件技术为目的。'
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
        <a href="https://github.com/lcpu-club" h-8 w-8 m-t-8>
          <AutoDarkImage
            :src="GithubMark"
            :src-dark="GithubMarkWhite"
            h-full
            w-full
            alt="Github 标识"
          />
        </a>
      </div>
      <div lg:col-span-2 overflow-auto p-y-12 p-r-6 lg:p-r-12 ref="scrollViewRef">
        <h2>项目</h2>
        <div grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2>
          <ProjectCard v-for="project in projects" :key="project.title" :project="project" />
        </div>

        <div m-t-12 v-for="category in categories" :key="category.title">
          <div flex="~ items-center">
            <h2 flex-grow-1>{{ category.title }}</h2>
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

          <div>
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
