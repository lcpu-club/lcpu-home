<script setup lang="ts">
import type { MarkdownItHeader } from '@mdit-vue/plugin-headers'

defineProps<{
  pageOutline?: MarkdownItHeader[]
}>()
</script>

<template>
  <nav v-if="pageOutline" flex-shrink-1 w-64 text-sm text-gray-500 dark:text-truegray-400>
    <div fixed top-12 p-x-4 box-border border-l="1 gray-200 solid dark:dark-200" w-56>
      <span block>本页目录</span>
      <ul p-l-0 m-0>
        <li
          overflow-hidden
          text-ellipsis
          text-nowrap
          w-full
          v-for="header in pageOutline"
          :key="header.slug"
          :style="{ marginLeft: `${(header.level - 2) * 1}rem` }"
        >
          <a :href="header.link" line-height-8 color-inherit decoration-none>
            {{ header.title }}
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>
