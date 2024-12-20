<script setup lang="ts">
import { useRoute } from '@/router/router';
import { defineAsyncComponent, inject, onMounted, ref, shallowRef, useTemplateRef, watch } from 'vue';
import rawNewsList from 'virtual:news-list.json'
import type { News } from '@/data/news';
import NotFoundView from '@/views/NotFoundView.vue';
import type { Module } from '@/module';
import { useTitle } from '@vueuse/core';
import { dateString } from '@/utils';
import NewsListView from './NewsListView.vue';
import SidebarComponent from '@/components/SidebarComponent.vue';
import TopbarComponent from '@/components/TopbarComponent.vue';
import LoadingView from './LoadingView.vue';

const route = useRoute();
const newsList: News[] = rawNewsList;
const newsModules = inject('newsModules') as Record<string, () => Promise<unknown>>;
const title = useTitle('', { titleTemplate: '%s | 新闻 - 北京大学 Linux 俱乐部' });
const currentNews = ref<News | null>();
const scrollViewRef = ref<HTMLDivElement>();
const sidebarRef = useTemplateRef('sidebar-ref')

async function resolvePageModule(routerPath: string): Promise<Module | never> {
  const url = new URL(routerPath, 'http://a.com');
  const path = url.pathname;

  currentNews.value = newsList.find((activity) => activity.contentUrl === path) || null;
  title.value = currentNews.value?.title;

  const modulePath = './data' + path + '.md';
  return new Promise(async (resolve) => {
    if (path === '/news/' || path === '/news') resolve(NewsListView as never)
    else if (modulePath in newsModules) {
      let module: Promise<Module> | Module = newsModules[modulePath]() as Promise<Module> | Module;
      if ('then' in module && typeof module.then === 'function') module = await module;
      resolve(module);
    }
    else resolve(NotFoundView as never);
  })
}

const Content = shallowRef(defineAsyncComponent(() => resolvePageModule(route.path)));

watch(route, async (newVal) => {
  Content.value = LoadingView as never;
  const module = await resolvePageModule(newVal.path);
  if ('default' in module)
    Content.value = module.default;
  else Content.value = module;
  scrollViewRef.value?.scrollTo({ top: 0, behavior: 'auto' });
  scrollViewRef.value?.scrollIntoView({ behavior: 'auto' });
})

onMounted(() => {
  scrollViewRef.value?.scrollTo({ top: 0, behavior: 'auto' });
  scrollViewRef.value?.scrollIntoView({ behavior: 'auto' });
})
</script>

<template>
  <div lg:grid lg:grid-cols-4 h-screen class="h-100dvh!">
    <SidebarComponent ref="sidebar-ref">
      <h3 m-b-2>新闻</h3>
      <div flex="~ col gap-2">
        <a @click="sidebarRef?.toggleSidebar()" v-for="news in newsList" :key="news.title" :href="news.contentUrl"
          text-wrap
          class="text-gray-500! dark:text-light-900! hover:text-gray-800! dark:hover:text-light-400! decoration-none">{{
            news.title
          }}</a>
      </div>
    </SidebarComponent>

    <div lg:col-span-3 p-y-12 p-x-6 md:p-x-12 overflow-auto ref="scrollViewRef">
      <TopbarComponent :toggleSidebarFn="sidebarRef?.toggleSidebar" />
      <div v-if="currentNews" m-b-8 max-w-800px m-x-auto m-t-4 lg:m-t-0>
        <h1 m-0>{{ currentNews.title }}</h1>
        <div flex="~ items-center gap-1" m-t-2 text-gray-500 dark:text-gray-300>
          <span>{{ dateString(currentNews.time) }}</span>
          <span v-if="currentNews.category?.trim()">·</span>
          <span v-if="currentNews.category?.trim()">{{ currentNews.category }}</span>
        </div>
      </div>
      <component :is="Content" max-w-800px m-x-auto />
    </div>
  </div>
</template>
