<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
const tips = [
  '海内存知己，天涯若比邻',
  '剑阁峥嵘而崔嵬\n一夫当关，万夫莫开',
  '与君初相识，犹如故人归',
  '有朋自远方来，不亦乐乎',
  '千门万户曈曈日，总把新桃换旧符',
  '你知道吗，有六句话可能在这里出现\n这是第六句',
]

const tipIndex = ref(Math.floor(Math.random() * tips.length))
const tip = computed(() => tips[tipIndex.value])

let interval: number
onMounted(() => {
  interval = setInterval(
    () => {
      let nextIndex = Math.floor(Math.random() * tips.length)
      while (nextIndex === tipIndex.value) {
        nextIndex = Math.floor(Math.random() * tips.length)
      }
      tipIndex.value = nextIndex
    },
    3000,
    null,
  )
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<template>
  <div w-full m-t-12>
    <div m-x-auto flex="~ col items-center">
      <div
        rounded-full
        bg-gradient-conic
        from-transparent
        to-black
        class="via-transparent via-25%"
        dark:to-white
        w-12
        h-12
        relative
        animate-spin
      >
        <div rounded-full class="bg-white dark:bg-[#121212]" w-10 h-10 left-1 top-1 absolute></div>
      </div>
      <h3 m-b-2>页面加载中</h3>
      <div flex="~ col items-center gap-1" text-center text-gray-500 dark:text-truegray-400>
        <Transition mode="out-in">
          <span :key="tip" whitespace-pre text-wrap>{{ tip }}</span>
        </Transition>
        <span>请坐和放宽</span>
      </div>
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
