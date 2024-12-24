<script setup lang="ts">
import ActivityListEntry from '@/components/ActivityListEntry.vue'
import type { Activity } from '@/data/activity'
import { groupByYearMonth } from '@/utils'
import rawActivityList from 'virtual:activity-list.json' with { type: 'json' }
const activityGroups = groupByYearMonth(rawActivityList as Activity[])
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
        <ActivityListEntry
          v-for="activity in activityGroup.items"
          :activity="activity"
          :key="activity.title"
        />
      </div>
    </div>
  </div>
</template>
