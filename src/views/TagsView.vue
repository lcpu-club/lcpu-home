<script setup lang="ts">
import { useRoute } from '@/router/router'
import TagList from '@/components/TagList.vue'
import allPages from 'virtual:pages.json'
import { computed, onMounted, ref } from 'vue'
import PageListEntry from '@/components/PageListEntry.vue'
import LoadingView from './LoadingView.vue'

const loading = ref(true)

const router = useRoute(() => undefined)
const url = new URL(router.path, 'https://a.com')
const currentTag = ref(decodeURIComponent(url.hash.slice(1)) || '')

const allTags = Array.from(new Set(allPages.flatMap((page) => page.tags || [])))
const displayingPages = computed(() => {
  if (loading.value) return []
  return allPages
    .filter((page) => page.tags?.includes(currentTag.value))
    .sort((a, b) => {
      return Date.parse(b.time) - Date.parse(a.time)
    })
})

onMounted(() => {
  loading.value = false
})
</script>

<template>
  <div v-if="loading"><LoadingView /></div>
  <div v-else class="-m-t-2">
    <TagList :tags="allTags" v-model="currentTag" />
    <div v-if="displayingPages.length" flex="~ col" m-t-8>
      <PageListEntry
        v-for="activity in displayingPages"
        :page-entry="activity"
        :key="activity.title"
      />
    </div>
    <div v-else-if="currentTag" text-gray-500 dark:text-truegray-400 m-t-8>
      没有找到相关标签的页面。
    </div>
    <div v-else text-gray-500 dark:text-truegray-400 m-t-8>请选择一个标签以查看相关页面。</div>
  </div>
</template>
