<script setup lang="ts">
import type { Event } from '@/data/event'
import { ArrowRightIcon } from '@heroicons/vue/24/outline'
import AutoDarkImage from './AutoDarkImage.vue'
import { onMounted, ref } from 'vue'

const classes = {
  red: 'text-red-400 border-red-400',
  green: 'text-green-400 border-green-400',
  gray: 'text-gray-400 border-gray-400',
}

const props = defineProps<{
  event: Event
}>()

const startDate = new Date(props.event.startDate)
const endDate = new Date(props.event.endDate)
const color = ref("")
const tag = ref("")

onMounted(() => {
  const nowDate = new Date()
  if (nowDate < startDate) {
    color.value = "gray"
    tag.value = "未开始"
  } else if ( nowDate < endDate ) {
    color.value = "green"
    tag.value = "进行中"
  } else {
    color.value = "red"
    tag.value = "已结束"
  }
})
</script>
<template>
  <a
    :href="event.link"
    :target="event.link.startsWith('/') ? '' : '_blank'"
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
      position-absolute top-0 end-0 mx-4 my-7 px-2 py-1 rounded-md border border-solid text-xs :class="classes[color]"
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
        v-if="event.image"
        :src="event.image"
        :src-dark="event.imageDark"
        :alt="event.title"
        object-contain
        w-8
        h-8
      />
      <span v-else text-xl>{{ event.title.charAt(0) }}</span>
    </div>
    <span m-t-1 text-xl font-semibold>{{ event.title }}</span>
    <p p-0 m-0 flex-1>{{ event.description }}</p>
    <ArrowRightIcon
      class="h-5 w-5 text-gray-500 self-end group-hover:translate-x-1 transition-transform duration-200"
    />
  </a>
</template>
