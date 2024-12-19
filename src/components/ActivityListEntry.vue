<script setup lang="ts">
import type { Activity } from '@/data/activity';
import { dateString } from '@/utils';

defineProps<{
  activity: Activity
}>();
</script>

<template>
  <div border-t="1 gray-200 dark:dark-100 solid" class="activity-list-entry" p-y-4 box-border>
    <h3 m-0>{{ activity.title }}</h3>
    <!-- doesn't seem to be the best way, but it works -->
    <span text-gray-500 block m-t-1 dark:text-gray-300>{{ dateString(activity.time) }}</span>
    <p v-if="activity.excerpt?.trim()" whitespace-pre text-wrap m-t-2 m-b-0>{{ activity.excerpt.trim() }}</p>
    <a :href="activity.contentUrl" text-blue-500 dark:text-blue-300 underline-offset-4 m-b-2 m-t-2 inline-block
      w-auto>阅读全文...</a>
  </div>
</template>

<style scoped>
.activity-list-entry:first-of-type {
  padding-top: 0;
  border-top: none;
}
</style>
