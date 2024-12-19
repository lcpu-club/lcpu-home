<script setup lang="ts">
import { useRoute } from '@/router/router';
import { defineAsyncComponent, inject, ref, shallowRef, watch } from 'vue';
import rawActivityList from 'virtual:activity-list.json'
import type { Activity } from '@/data/activity';
import AutoDarkImage from '@/components/AutoDarkImage.vue';
import LcpuLight from '@/assets/lcpu-light.svg';
import LcpuDark from '@/assets/lcpu-dark.svg';
import NotFoundView from '@/views/NotFoundView.vue';
import type { Module } from '@/module';
import { useTitle } from '@vueuse/core';
import { dateString } from '@/utils';

const route = useRoute();
const activityList: Activity[] = rawActivityList;
const activityModules = inject('activityModules') as Record<string, () => Promise<unknown>>;
const title = useTitle('', { titleTemplate: '%s | 活动 - 北京大学 Linux 俱乐部' });
const currentActivity = ref<Activity | null>();
const scrollViewRef = ref<HTMLDivElement>();

// let's also update page title since we have access to the pathname property.
async function resolvePageModule(routerPath: string): Promise<Module> {
  const url = new URL(routerPath, 'http://a.com');
  const path = url.pathname;

  currentActivity.value = activityList.find((activity) => activity.contentUrl === path) || null;
  title.value = currentActivity.value?.title;

  const modulePath = './data' + path + '.md';
  return new Promise(async (resolve) => {
    if (modulePath in activityModules) {
      let module: Promise<Module> | Module = activityModules[modulePath]() as Promise<Module> | Module;
      if ('then' in module && typeof module.then === 'function') module = await module;
      resolve(module);
    }
    else resolve(NotFoundView as unknown as Module);
  })
}

const Content = shallowRef(defineAsyncComponent(() => resolvePageModule(route.path)));

watch(route, async (newVal) => {
  Content.value = (await resolvePageModule(newVal.path)).default;
  scrollViewRef.value?.scrollTo({ top: 0, behavior: 'auto' });
})
</script>

<template>
  <div lg:grid lg:grid-cols-4 h-screen h-100dvh>
    <div hidden lg:display-unset p-12 bg-gray-100 dark:bg-dark-800 overflow-auto>
      <a flex="~ items-center gap-2" href="/" class="text-unset! decoration-none">
        <AutoDarkImage h-8 :src="LcpuDark" :src-dark="LcpuLight" />
        <span text-xl font-semibold>LCPU</span>
      </a>
      <h3 m-b-2>活动</h3>
      <div flex="~ col gap-2">
        <a v-for="activity in activityList" :key="activity.title" :href="activity.contentUrl" text-wrap
          class="text-gray-500! dark:text-light-900! hover:text-gray-800! dark:hover:text-light-400! decoration-none">{{
            activity.title
          }}</a>
      </div>
    </div>
    <div lg:col-span-3 p-y-12 p-x-6 md:p-x-12 overflow-auto ref="scrollViewRef">
      <div v-if="currentActivity" m-b-8 max-w-800px m-x-auto>
        <h1 m-0>{{ currentActivity.title }}</h1>
        <span text-gray-500 block m-t-2 dark:text-gray-300>{{ dateString(currentActivity.time) }}</span>
      </div>
      <component :is="Content" max-w-800px m-x-auto />
    </div>
  </div>
</template>
