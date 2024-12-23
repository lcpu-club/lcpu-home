<script setup lang="ts">
import { useRoute } from '@/router/router';
import { defineAsyncComponent, inject, onMounted, ref, shallowRef, useSSRContext, useTemplateRef, watch } from 'vue';
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
import type { SSRContext } from 'vue/server-renderer';

const route = useRoute(() => scrollViewRef.value?.scrollTop);
const newsList: News[] = rawNewsList;
const newsModules = inject('newsModules') as Record<string, () => Promise<unknown>>;
const title = useTitle('', { titleTemplate: '%s新闻 - 北京大学学生 Linux 俱乐部' });
const currentNews = ref<News | null>();
const scrollViewRef = ref<HTMLDivElement>();
const showTitle = ref(false);
const sidebarRef = useTemplateRef('sidebar-ref')
let ssrContext: SSRContext | undefined;
if (import.meta.env.SSR) ssrContext = useSSRContext();

async function resolvePageModule(routerPath: string): Promise<Module | never> {
  const url = new URL(routerPath, 'http://a.com');
  const path = url.pathname;

  currentNews.value = newsList.find((activity) => activity.contentUrl === path) || null;
  title.value = currentNews.value?.title ? currentNews.value.title + ' | ' : '';

  if (ssrContext) ssrContext.titlePrefix = title.value + '新闻 - ';

  const modulePath = './data' + path + '.md';
  return new Promise(async (resolve) => {
    if (path === '/news/' || path === '/news/index' || path === '/news/index.html') resolve(NewsListView as never)
    else if (modulePath in newsModules) {
      let module: Promise<Module> | Module = newsModules[modulePath]() as Promise<Module> | Module;
      if ('then' in module && typeof module.then === 'function') module = await module;
      resolve(module);
    }
    else resolve(NotFoundView as never);
  })
}

const Content = shallowRef(defineAsyncComponent(() => resolvePageModule(route.path)));

watch(() => route.path, async (newVal) => {
  Content.value = LoadingView as never;
  const module = await resolvePageModule(newVal);
  if ('default' in module) Content.value = module.default;
  else Content.value = module;
  scrollViewRef.value?.scrollTo({ top: route.scrollTop, behavior: 'instant' });
})

onMounted(() => {
  scrollViewRef.value?.scrollTo({ top: route.scrollTop, behavior: 'instant' });
})

function handleScroll() {
  const scrollTop = scrollViewRef.value?.scrollTop;
  if (scrollTop == undefined) return;
  if (scrollTop > 60) {
    showTitle.value = true;
  } else {
    showTitle.value = false;
  }
}
</script>

<template>
  <div lg:grid lg:grid-cols-4 h-screen class="h-100dvh!" overflow-auto>
    <SidebarComponent ref="sidebar-ref" :current-title="currentNews?.title" />

    <div lg:col-span-3 p-y-12 p-x-6 lg:p-x-12 overflow-auto h-screen class="h-100dvh!" box-border ref="scrollViewRef"
      @scroll="handleScroll">
      <TopbarComponent :toggleSidebarFn="sidebarRef?.toggleSidebar" :title="currentNews?.title ?? '新闻'"
        :show-title="showTitle" />
      <div v-if="currentNews" m-b-8 max-w-800px m-x-auto m-t-4 lg:m-t-0>
        <h1 m-0>{{ currentNews.title }}</h1>
        <div flex="~ items-center gap-1" m-t-2 text-gray-500 dark:text-gray-300>
          <span>{{ dateString(currentNews.time) }}</span>
          <span v-if="currentNews.category?.trim()">·</span>
          <span v-if="currentNews.category?.trim()">{{ currentNews.category }}</span>
        </div>
      </div>
      <Transition mode="out-in">
        <component :is="Content" max-w-800px m-x-auto />
      </Transition>
    </div>
  </div>
</template>

<style lang="css" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.4s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
