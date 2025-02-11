<script setup lang="ts">
import type { Item } from '@/data/item'
import { ArrowRightIcon } from '@heroicons/vue/24/outline'
import AutoDarkImage from './AutoDarkImage.vue'

defineProps<{
  item: Item
  tag: string
  tagClass: string
}>()
</script>
<template>
  <a
    :href="item.link"
    :target="item.link.startsWith('/') ? '' : '_blank'"
    rel="noopener noreferrer"
    decoration-none
    rounded-xl
    bg-gray-100
    dark:bg-dark-600
    flex="~ col gap-2"
    w-full
    h-auto
    p-4
    box-border
    border="1 gray-200 dark:dark-100 solid"
    class="group text-unset! position-relative"
  >
    <span
      v-if="tag"
      position-absolute
      top-0
      end-0
      mx-4
      my-7
      px-2
      py-1
      rounded-md
      border
      border-solid
      text-xs
      :class="tagClass"
    >
      {{ tag }}
    </span>
    <div
      h-12
      w-12
      rounded-md
      bg-gray-200
      dark:bg-dark-700
      flex
      justify-center
      items-center
      box-border
      p-2
      border="1 gray-300 dark:dark-200 solid"
    >
      <AutoDarkImage
        v-if="item.image"
        :src="item.image"
        :src-dark="item.imageDark"
        :alt="item.title"
        object-contain
        w-8
        h-8
      />
      <span v-else text-xl>{{ item.title.charAt(0) }}</span>
    </div>
    <span m-t-1 text-xl font-semibold>{{ item.title }}</span>
    <p p-0 m-0 flex-1>{{ item.description }}</p>
    <ArrowRightIcon
      class="h-5 w-5 text-gray-500 self-end group-hover:translate-x-1 transition-transform duration-200"
    />
  </a>
</template>
