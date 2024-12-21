<script setup lang="ts">
import NewsListEntry from '@/components/NewsListEntry.vue';
import type { News } from '@/data/news';
import { groupByYearMonth } from '@/utils';
import rawNewsList from 'virtual:news-list.json' with {type: 'json'};
const newsGroups = groupByYearMonth(rawNewsList as News[]);
</script>

<template>
  <div>
    <h1 m-t-4 lg:m-t-0>所有新闻</h1>
    <div flex="~ col gap-10" m-t-10>
      <div relative v-for="newsGroup in newsGroups" :key="newsGroup.year + '-' + newsGroup.month">
        <h2 m-0 text-stroke-1 text-5xl font-bold text-stroke-gray-300 dark:text-stroke-truegray-600 dark:text-stroke-1.5
          m-b-2 text-right absolute right-0 class="-top-12" text-transparent select-none tracking-wide>{{
            newsGroup.year }}<br />
          {{
            newsGroup.month.toString().padStart(2, '0') }}
        </h2>
        <newsListEntry v-for="news in newsGroup.items" :news="news" :key="news.title" />
      </div>
    </div>
  </div>
</template>
