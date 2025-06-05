<script setup lang="ts">
import { useRoute } from '@/router/router'
import TagList from '@/components/TagList.vue'
import allPages from 'virtual:pages.json'
import { computed, ref } from 'vue'
import PageListEntry from '@/components/PageListEntry.vue'

const router = useRoute(() => undefined)
const url = new URL(router.path, 'https://a.com')
const currentTag = ref(decodeURIComponent(url.hash.slice(1)) || '')

const allTags = Array.from(new Set(allPages.flatMap((page) => page.tags || [])))
const displayingPages = computed(() => {
  if (!currentTag.value) return allPages
  return allPages.filter((page) => page.tags?.includes(currentTag.value))
})
</script>

<template>
  <div>
    <TagList :tags="allTags" v-model="currentTag" />
    <div flex="~ col" m-t-12>
      <PageListEntry
        v-for="activity in displayingPages"
        :page-entry="activity"
        :key="activity.title"
      />
    </div>
  </div>
</template>
