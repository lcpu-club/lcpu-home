<script setup lang="ts">
import PageListEntry from '@/components/PageListEntry.vue'
import { useRoute } from '@/router/router'
import { groupByYearMonth, indexPageRe } from '@/utils'
import categoryList from 'virtual:category-list.json'

const route = useRoute(() => undefined)
const path = route.path
const pathname = new URL(path, 'http://localhost').pathname
const match = pathname.match(indexPageRe)
let base: string | null = null
if (match) base = match[1]
const pages = categoryList.find((list) => list.routeBase === base)?.pages ?? []
const pageGroups = groupByYearMonth(pages)
</script>

<template>
  <div>
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
