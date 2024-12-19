<script setup lang="ts">
import { useRoute } from '@/router/router';
import { ref, watch } from 'vue';
import rawNewsList from 'virtual:news-list.json'
import type { News } from '@/data/news';
import AutoDarkImage from '@/components/AutoDarkImage.vue';
import LcpuLight from '@/assets/lcpu-light.svg';
import LcpuDark from '@/assets/lcpu-dark.svg';

const route = useRoute();
const Content = ref(route.innerComponent);
const newsList: News[] = rawNewsList;

console.log(route.path)

watch(route, (newVal) =>
  Content.value = newVal.innerComponent
)

</script>

<template>
  <div md:grid lg:grid-cols-4 h-screen>
    <div hidden lg:display-unset p-12 bg-gray-100 dark:bg-dark-800 overflow-auto>
      <a flex="~ items-center gap-2" href="/" class="text-unset! decoration-none">
        <AutoDarkImage h-8 :src="LcpuDark" :src-dark="LcpuLight" />
        <span text-xl font-semibold>LCPU</span>
      </a>
      <h3 m-b-2>新闻</h3>
      <div flex="~ col gap-2">
        <a v-for="news in newsList" :key="news.title" :href="news.contentUrl" text-wrap
          class="text-gray-500! dark:text-light-900! hover:text-gray-800! dark:hover:text-light-400! decoration-none">{{
            news.title
          }}</a>
      </div>
    </div>
    <div md-col-span-3 p-12 overflow-auto>
      <component :is="Content" />
    </div>
  </div>
</template>
