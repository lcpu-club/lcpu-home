<script setup lang="ts">
import { useRoute } from '@/router/router';
import { defineAsyncComponent, inject, onMounted, ref, shallowRef, useTemplateRef, watch } from 'vue';
import rawActivityList from 'virtual:activity-list.json'
import type { Activity } from '@/data/activity';
import NotFoundView from '@/views/NotFoundView.vue';
import type { Module } from '@/module';
import { useTitle } from '@vueuse/core';
import { dateString } from '@/utils';
import ActivityListView from './ActivityListView.vue';
import SidebarComponent from '@/components/SidebarComponent.vue';
import TopbarComponent from '@/components/TopbarComponent.vue';
import LoadingView from './LoadingView.vue';

const route = useRoute();
const activityList: Activity[] = rawActivityList;
const activityModules = inject('activityModules') as Record<string, () => Promise<unknown>>;
const title = useTitle('', { titleTemplate: '%s | 活动 - 北京大学 Linux 俱乐部' });
const currentActivity = ref<Activity | null>();
const scrollViewRef = ref<HTMLDivElement>();
const showTitle = ref(false);
const sidebarRef = useTemplateRef('sidebar-ref')

// let's also update page title since we have access to the pathname property.
async function resolvePageModule(routerPath: string): Promise<Module | never> {
  const url = new URL(routerPath, 'http://a.com');
  const path = url.pathname;

  currentActivity.value = activityList.find((activity) => activity.contentUrl === path) || null;
  title.value = currentActivity.value?.title;

  const modulePath = './data' + path + '.md';
  return new Promise(async (resolve) => {
    if (path === '/activities/' || path === '/activities') resolve(ActivityListView as never);
    else if (modulePath in activityModules) {
      let module: Promise<Module> | Module = activityModules[modulePath]() as Promise<Module> | Module;
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
  if ('default' in module) Content.value = module.default;
  else Content.value = module;
  scrollViewRef.value?.scrollTo({ top: 0, behavior: 'auto' });
})

onMounted(() => {
  scrollViewRef.value?.scrollTo({ top: 0, behavior: 'auto' });
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
    <SidebarComponent ref="sidebar-ref">
      <h3 m-b-2><a href="/activities/" class="text-unset!" decoration-none @click="sidebarRef?.toggleSidebar()">活动</a>
      </h3>
      <div flex="~ col gap-2">
        <a @click="sidebarRef?.toggleSidebar()" v-for="activity in activityList" :key="activity.title"
          :href="activity.contentUrl" text-wrap
          class="text-gray-500! dark:text-light-900! hover:text-gray-800! dark:hover:text-light-400! decoration-none">{{
            activity.title
          }}</a>
      </div>
    </SidebarComponent>

    <div lg:col-span-3 p-y-12 p-x-6 lg:p-x-12 overflow-auto h-screen box-border ref="scrollViewRef"
      @scroll="handleScroll">
      <TopbarComponent :toggleSidebarFn="sidebarRef?.toggleSidebar" :title="title ?? '活动'" :show-title="showTitle" />
      <div v-if="currentActivity" m-b-8 max-w-800px m-x-auto m-t-4 lg:m-t-0>
        <h1 m-0>{{ currentActivity.title }}</h1>
        <span text-gray-500 block m-t-2 dark:text-gray-300>{{ dateString(currentActivity.time) }}</span>
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
