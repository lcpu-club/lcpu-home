<script setup lang="ts">
import PageListEntry from '@/components/PageListEntry.vue'
import { useRoute } from '@/router/router'
import { groupByYearMonth } from '@/utils'
import allPages from 'virtual:pages.json'
import { isIndexPage } from '@/utils'

const route = useRoute(() => undefined)
const path = route.path
const pathname = new URL(path, 'http://localhost').pathname
const urlSlugs = pathname.split('/').filter((slug) => slug)
let base: string | null = null
if (isIndexPage(urlSlugs)) base = urlSlugs[0]
const pages = allPages
  .filter((page) => page.category === base)
  .sort((a, b) => Date.parse(b.time) - Date.parse(a.time))

const pageGroups = groupByYearMonth(pages)
</script>

<template>
  <div p-t-6>
    <div flex="~ col gap-10">
      <div relative v-for="pageGroup in pageGroups" :key="pageGroup.year + '-' + pageGroup.month">
        <h2
          m-0
          text-stroke-1
          text-5xl
          font-bold
          text-stroke-gray-300
          dark:text-stroke-truegray-600
          dark:text-stroke-1.5
          m-b-2
          text-right
          absolute
          right-0
          class="-top-12"
          text-transparent
          select-none
          tracking-wide
        >
          {{ pageGroup.year }}<br />
          {{ pageGroup.month.toString().padStart(2, '0') }}
        </h2>
        <PageListEntry
          v-for="activity in pageGroup.items"
          :page-entry="activity"
          :key="activity.title"
        />
      </div>
    </div>
  </div>
</template>
