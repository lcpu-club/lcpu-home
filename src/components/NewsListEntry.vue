<script setup lang="ts">
import type { News } from '@/data/news';

defineProps<{
    news: News;
}>();
</script>

<template>
    <div border-t="1 gray-200 solid" class="news-list-entry" p-y-4 box-border>
        <h3 m-0>{{ news.title }}</h3>
        <!-- doesn't seem to be the best way, but it works -->
        <div flex="~ items-center gap-2" m-t-1 text-gray-500>
            <span>{{ new Date(news.time).toLocaleString('zh', {
                timeZone: 'UTC',
                year: "numeric",
                month: "long",
                day: "numeric",
            }) }}</span>
            <span v-if="news.category?.trim()">·</span>
            <span v-if="news.category?.trim()">{{ news.category }}</span>
        </div>
        <p v-if="news.excerpt?.trim()" whitespace-pre text-wrap m-t-2 m-b-0>{{ news.excerpt.trim() }}</p>
        <a :href="news.contentUrl" text-blue-500 underline-offset-4 m-b-2 m-t-2 inline-block w-auto>阅读全文...</a>
    </div>
</template>

<style scoped>
.news-list-entry:first-of-type {
    padding-top: 0;
    border-top: none;
}
</style>