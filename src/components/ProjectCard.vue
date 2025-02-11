<script setup lang="ts">
import type { Project } from '@/data/project'
import { ArrowRightIcon } from '@heroicons/vue/24/outline'
import AutoDarkImage from './AutoDarkImage.vue'

defineProps<{
  project: Project,
  pkuNetwork: bool
}>()
</script>
<template>
  <a
    :href="project.link"
    :target="project.link.startsWith('/') ? '' : '_blank'"
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
      v-if="project.internal && !pkuNetwork" position-absolute top-0 end-0 mx-4 my-7 px-2 py-1 border-red-400 text-red-400 rounded-md border border-solid text-xs
    >
    仅校园网
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
        v-if="project.image"
        :src="project.image"
        :src-dark="project.imageDark"
        :alt="project.title"
        object-contain
        w-8
        h-8
      />
      <span v-else text-xl>{{ project.title.charAt(0) }}</span>
    </div>
    <span m-t-1 text-xl font-semibold>{{ project.title }}</span>
    <p p-0 m-0 flex-1>{{ project.description }}</p>
    <ArrowRightIcon
      class="h-5 w-5 text-gray-500 self-end group-hover:translate-x-1 transition-transform duration-200"
    />
  </a>
</template>
