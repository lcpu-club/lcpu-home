<script setup lang="ts">
import { useRoute } from '@/router/router';
import { defineAsyncComponent, inject, shallowRef, watch } from 'vue';
import rawNewsList from 'virtual:news-list.json'
import type { News } from '@/data/news';
import AutoDarkImage from '@/components/AutoDarkImage.vue';
import LcpuLight from '@/assets/lcpu-light.svg';
import LcpuDark from '@/assets/lcpu-dark.svg';
import NotFoundView from '@/views/NotFoundView.vue';
import type { Module } from '@/module';

const route = useRoute();
const newsList: News[] = rawNewsList;
const newsModules = inject('newsModules') as Record<string, () => Promise<unknown>>;

async function resolvePageModule(routerPath: string): Promise<Module> {
  const url = new URL(routerPath, 'http://a.com');
  const path = url.pathname;
  const modulePath = './data' + path + '.md';
  return new Promise(async (resolve) => {
    if (modulePath in newsModules) {
      let module: Promise<Module> | Module = newsModules[modulePath]() as Promise<Module> | Module;
      if ('then' in module && typeof module.then === 'function') module = await module;
      resolve(module);
    }
    else resolve(NotFoundView as unknown as Module);
  })
}

const Content = shallowRef(defineAsyncComponent(() => resolvePageModule(route.path)));

watch(route, async (newVal) => {
  Content.value = (await resolvePageModule(newVal.path)).default;
})

</script>

<template>
  <div lg:grid lg:grid-cols-4 h-screen>
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
    <div lg:col-span-3 p-y-12 p-x-6 md:p-x-12 overflow-auto>
      <component :is="Content" />
    </div>
  </div>
</template>
