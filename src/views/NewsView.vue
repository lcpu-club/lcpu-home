<script setup lang="ts">
import { useRoute } from '@/router/router';
import { defineAsyncComponent, inject, ref, shallowRef, watch } from 'vue';
import rawNewsList from 'virtual:news-list.json'
import type { News } from '@/data/news';
import AutoDarkImage from '@/components/AutoDarkImage.vue';
import LcpuLight from '@/assets/lcpu-light.svg';
import LcpuDark from '@/assets/lcpu-dark.svg';
import NotFoundView from '@/views/NotFoundView.vue';
import type { Module } from '@/module';
import { useTitle } from '@vueuse/core';
import { dateString } from '@/utils';
import NewsListView from './NewsListView.vue';
import { Bars3BottomLeftIcon } from '@heroicons/vue/20/solid';

const route = useRoute();
const newsList: News[] = rawNewsList;
const newsModules = inject('newsModules') as Record<string, () => Promise<unknown>>;
const title = useTitle('', { titleTemplate: '%s | 新闻 - 北京大学 Linux 俱乐部' });
const currentNews = ref<News | null>();
const scrollViewRef = ref<HTMLDivElement>();
const sidebarCollapsed = ref(true);

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
  const module = await resolvePageModule(newVal.path);
  if ('default' in module)
    Content.value = module.default;
  else Content.value = module;
  scrollViewRef.value?.scrollTo({ top: 0, behavior: 'auto' });
})

function toggleSidebar(collapse?: boolean) {
  if (collapse) sidebarCollapsed.value = collapse;
  else
    sidebarCollapsed.value = !sidebarCollapsed.value;
}
</script>

<template>
  <div lg:grid lg:grid-cols-4 h-screen h-100dvh>
    <div w-screen lg:w-unset box-border fixed lg:position-unset h-full z-999 transition-all duration-300
      @click="toggleSidebar(true)" pointer-events-none
      :class="{ 'backdrop-brightness-20 pointer-events-unset': !sidebarCollapsed }">
      <div @click.stop h-full box-border p-x-6 p-y-12 md:p-x-12 bg-gray-100 dark:bg-dark-800 transition-all duration-300
        overflow-auto class="w-80% max-w-400px lg:w-full lg:max-w-unset -translate-x-400px lg:translate-x-0"
        :class="{ 'translate-x-0!': !sidebarCollapsed }">
        <a flex="~ items-center gap-2" href="/" class="text-unset! decoration-none">
          <AutoDarkImage h-8 :src="LcpuDark" :src-dark="LcpuLight" />
          <span text-xl font-semibold>LCPU</span>
        </a>
        <h3 m-b-2>新闻</h3>
        <div flex="~ col gap-2">
          <a @click="toggleSidebar()" v-for="news in newsList" :key="news.title" :href="news.contentUrl" text-wrap
            class="text-gray-500! dark:text-light-900! hover:text-gray-800! dark:hover:text-light-400! decoration-none">{{
              news.title
            }}</a>
        </div>
      </div>
    </div>

    <div lg:col-span-3 p-y-12 p-x-6 md:p-x-12 overflow-auto ref="scrollViewRef">
      <div lg:hidden fixed top-0 left-0 right-0 backdrop-blur-xl h-16 p-x-6>
        <div w-full max-w-800px m-x-auto>
          <button @click="toggleSidebar()" border-none bg-transparent h-16 flex="~ items-center justify-center">
            <Bars3BottomLeftIcon class="w-6 h-6 text-black dark:text-white" />
          </button>
        </div>
      </div>
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
