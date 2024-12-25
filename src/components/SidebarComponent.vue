<script setup lang="ts">
import { ref } from 'vue'
import AutoDarkImage from '@/components/AutoDarkImage.vue'
import LcpuLight from '@/assets/lcpu-light.svg'
import LcpuDark from '@/assets/lcpu-dark.svg'
import rawActivityList from 'virtual:activity-list.json'
import rawNewsList from 'virtual:news-list.json'
import type { PageData } from '@/data/pagedata'
import { groupByYearMonth } from '@/utils'
import ExpanderComponent from './ExpanderComponent.vue'

const activityListGrouped = groupByYearMonth(rawActivityList as PageData[])
const newsListGrouped = groupByYearMonth(rawNewsList as PageData[])

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

      <ExpanderComponent m-t-4>
        <template #header>
          <h3 m-0>
            <a href="/activities/" class="text-unset!" decoration-none @click="toggleSidebar()"
              >活动</a
            >
          </h3>
        </template>
        <div flex="~ col" box-border>
          <div
            v-for="activityGroup in activityListGrouped"
            :key="activityGroup.year + '-' + activityGroup.month"
            flex="~ col gap-2"
            class="group"
            border-t-1
            border-gray-200
            dark:border-dark-200
            border-t-solid
            p-y-3
          >
            <span text-xs text-gray-500 dark:text-light-900
              >{{ activityGroup.year }} 年 {{ activityGroup.month }} 月
            </span>
            <a
              v-for="activity in activityGroup.items"
              @click="toggleSidebar()"
              :href="activity.contentUrl"
              text-wrap
              :key="activity.title"
              class="text-gray-500! dark:text-light-900! hover:text-gray-800! dark:hover:text-light-400! decoration-none"
              :class="{
                'text-gray-800! dark:text-white! font-medium': currentTitle === activity.title,
              }"
            >
              {{ activity.title }}</a
            >
          </div>
        </div>
      </ExpanderComponent>

      <ExpanderComponent m-t-4>
        <template #header>
          <h3 m-0>
            <a href="/news/" class="text-unset!" decoration-none @click="toggleSidebar()">新闻</a>
          </h3>
        </template>
        <div flex="~ col" box-border>
          <div
            v-for="newsGroup in newsListGrouped"
            :key="newsGroup.year + '-' + newsGroup.month"
            flex="~ col gap-2"
            p-y-3
            class="group"
            border-t-1
            border-gray-200
            dark:border-dark-200
            border-t-solid
          >
            <span text-xs text-gray-500 dark:text-light-900
              >{{ newsGroup.year }} 年 {{ newsGroup.month }} 月
            </span>
            <a
              v-for="news in newsGroup.items"
              @click="toggleSidebar()"
              :href="news.contentUrl"
              text-wrap
              :key="news.title"
              class="text-gray-500! dark:text-light-900! hover:text-gray-800! dark:hover:text-light-400! decoration-none"
              :class="{
                'text-gray-800! dark:text-light-400! font-medium': currentTitle === news.title,
              }"
              >{{ news.title }}</a
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
