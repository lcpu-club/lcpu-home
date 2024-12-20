<script setup lang="ts">
import NewsListEntry from '@/components/NewsListEntry.vue';
import type { News } from '@/data/news';
import { useTitle } from '@vueuse/core';
import rawNewsList from 'virtual:news-list.json' with {type: 'json'};
const newsList = rawNewsList as News[];
useTitle('新闻 - 北京大学 Linux 俱乐部')
</script>

<template>
  <div>
    <h1 m-t-4 lg:m-t-0>所有新闻</h1>
    <div>
      <NewsListEntry v-for="news in newsList" :news="news" :key="news.title" />
    </div>
  </div>
</template>
