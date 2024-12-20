<script setup lang="ts">
import ActivityListEntry from '@/components/ActivityListEntry.vue';
import type { Activity } from '@/data/activity';
import { useTitle } from '@vueuse/core';
import rawActivityList from 'virtual:activity-list.json' with {type: 'json'};
const activityList = rawActivityList as Activity[];
useTitle('活动 - 北京大学 Linux 俱乐部')
</script>

<template>
  <div>
    <h1 m-t-4 lg:m-t-0>所有活动</h1>
    <div>
      <ActivityListEntry v-for="activity in activityList" :activity="activity" :key="activity.title" />
    </div>
  </div>
</template>
