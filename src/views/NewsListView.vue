<script setup lang="ts">
import NewsListEntry from '@/components/NewsListEntry.vue';
import type { News } from '@/data/news';
import rawNewsList from 'virtual:news-list.json' with {type: 'json'};
const newsList = rawNewsList as News[];

</script>

<template>
  <div>
    <h1 m-t-4 lg:m-t-0>所有新闻</h1>
    <div>
      <NewsListEntry v-for="news in newsList" :news="news" :key="news.title" />
    </div>
  </div>
</template>
