<script setup lang="ts">
import PageListEntry from '@/components/PageListEntry.vue'
import type { PageData } from '@/data/pagedata'
import { groupByYearMonth } from '@/utils'
import rawActivityList from 'virtual:activity-list.json'
const activityGroups = groupByYearMonth(rawActivityList as PageData[])
</script>

<template>
  <div>
    <h1 m-t-4 lg:m-t-0>所有活动</h1>
    <div flex="~ col gap-10" m-t-10>
      <div
        relative
        v-for="activityGroup in activityGroups"
        :key="activityGroup.year + '-' + activityGroup.month"
      >
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
          {{ activityGroup.year }}<br />
          {{ activityGroup.month.toString().padStart(2, '0') }}
        </h2>
        <PageListEntry
          v-for="activity in activityGroup.items"
          :page-entry="activity"
          :key="activity.title"
        />
      </div>
    </div>
  </div>
</template>
