<script setup lang="ts">
import { ref } from 'vue'
import AutoDarkImage from '@/components/AutoDarkImage.vue'
import LcpuLight from '@/assets/lcpu-light.svg'
import LcpuDark from '@/assets/lcpu-dark.svg'
import allPages from 'virtual:pages.json'
import { groupByYearMonth } from '@/utils'
import ExpanderComponent from './ExpanderComponent.vue'
import { SiteConfiguration, RouteTitleRecord } from '@/site'
import type { PageData } from '@/data/pagedata'

const categories: {
  title: string
  route: string
  pageGroups: { year: number; month: number; items: PageData[] }[]
}[] = []

Object.keys(RouteTitleRecord).forEach((category) => {
  categories.push({
    title: SiteConfiguration.getRouteCategoryTitle(category),
    route: `/${category}/`,
    pageGroups: groupByYearMonth(
      allPages
        .filter((page) => page.category === category)
        .sort((a, b) => Date.parse(b.time) - Date.parse(a.time)),
    ),
  })
})
const sidebarCollapsed = ref(true)
const toggleSidebar = (collapse?: boolean) => {
  if (collapse === undefined) {
    sidebarCollapsed.value = !sidebarCollapsed.value
  } else {
    sidebarCollapsed.value = collapse
  }
}

defineProps<{
  currentTitle: string | null | undefined
}>()

defineExpose({ toggleSidebar })
</script>

<template>
  <div
    w-screen
    h-screen
    lg:w-unset
    box-border
    fixed
    lg:position-unset
    h-full
    z-999
    transition-all
    duration-300
    @click="toggleSidebar(true)"
    pointer-events-none
    lg:pointer-events-unset
    class="h-100dvh!"
    :class="{ 'backdrop-brightness-40 pointer-events-unset': !sidebarCollapsed }"
  >
    <div
      @click.stop
      h-full
      box-border
      p-x-6
      p-y-12
      md:p-x-12
      bg-gray-100
      dark:bg-dark-800
      transition-all
      duration-300
      overflow-auto
      class="w-80% max-w-400px lg:w-full lg:max-w-unset -translate-x-100% lg:translate-x-0"
      :class="{ 'translate-x-0! shadow-xl': !sidebarCollapsed }"
      lg:shadow-none
    >
      <a flex="~ items-center gap-2" href="/" class="text-unset! decoration-none">
        <AutoDarkImage h-8 :src="LcpuDark" :src-dark="LcpuLight" alt="LCPU 标识" />
        <span text-xl font-semibold>LCPU</span>
      </a>

      <ExpanderComponent m-t-4 v-for="category in categories" :key="category.title">
        <template #header>
          <h3 m-0>
            <a
              :href="category.route"
              class="text-unset!"
              decoration-none
              @click="toggleSidebar()"
              >{{ category.title }}</a
            >
          </h3>
        </template>
        <div flex="~ col" box-border>
          <div
            v-for="pageGroup in category.pageGroups"
            :key="pageGroup.year + '-' + pageGroup.month"
            flex="~ col gap-2"
            class="group"
            border-t-1
            border-gray-200
            dark:border-dark-200
            border-t-solid
            p-y-3
          >
            <span text-xs text-gray-500 dark:text-truegray-400
              >{{ pageGroup.year }} 年 {{ pageGroup.month }} 月
            </span>
            <a
              v-for="page in pageGroup.items"
              @click="toggleSidebar()"
              :href="page.contentUrl"
              text-wrap
              :key="page.title"
              class="text-gray-500! dark:text-truegray-400! hover:text-gray-800! dark:hover:text-white! decoration-none"
              :class="{
                'text-gray-800! dark:text-white! font-medium': currentTitle === page.title,
              }"
            >
              {{ page.title }}</a
            >
          </div>
        </div>
      </ExpanderComponent>
    </div>
  </div>
</template>

<style scoped>
.group:first-of-type {
  --at-apply: border-t-0;
}

a {
  transition: color 0.2s;
}
</style>
