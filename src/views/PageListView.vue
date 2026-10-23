<script setup lang="ts">
import PageListEntry from '@/components/PageListEntry.vue'
import { useRoute } from '@/router/router'
import { groupByYearMonth } from '@/utils'
import allPages from 'virtual:pages.json'
import { isIndexPage } from '@/utils'
import { computed } from 'vue'

const route = useRoute()
const pageGroups = computed(() => {
  const slugs = new URL(route.path, 'https://lcpu.dev').pathname.split('/').filter(Boolean)
  const base = isIndexPage(slugs) ? slugs[0] : null
  return groupByYearMonth(
    allPages
      .filter((page) => page.category === base)
      .sort((a, b) => Date.parse(b.time) - Date.parse(a.time)),
  )
})
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
