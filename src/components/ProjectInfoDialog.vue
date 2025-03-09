<script setup lang="ts">
import type { Project } from '@/data/project'
import DialogComponent from './DialogComponent.vue'
import { ref, useTemplateRef } from 'vue'
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/16/solid'
const currentProject = ref<Project>()
const dialogRef = useTemplateRef('dialog')
function showProjectInfo(project: Project) {
  currentProject.value = project
  dialogRef.value?.toggleShown()
}
defineExpose({
  showProjectInfo,
})
</script>

<template>
  <DialogComponent ref="dialog">
    <template #title>
      <div flex="~ items-center gap-2" m-b-2>
        <h2 inline m-0>{{ currentProject?.title }}</h2>
        <a
          :href="currentProject?.link"
          :target="currentProject?.link.startsWith('/') ? '' : '_blank'"
          ><ArrowTopRightOnSquareIcon class="h-6 w-6"
        /></a>
      </div>
    </template>
    <h3 m-t-0>负责人</h3>
    <div gap-4 grid grid-cols-2 md:grid-cols-3>
      <!-- eslint-disable-next-line vue/require-v-for-key -->
      <div v-for="p in currentProject?.personInCharge" flex="~ items-center">
        <img h-12 w-12 rounded-full :src="p.avatar" />
        <div m-l-2>
          <span block text-lg>{{ p.name }}</span>
          <span block text-sm text-gray-500 dark:text-truegray-400>@{{ p.username }}</span>
        </div>
      </div>
    </div>
    <h3 m-t-4 m-b-2>路线图</h3>
    <div>
      <!-- eslint-disable-next-line vue/require-v-for-key -->
      <div v-for="milestone in currentProject?.roadmap.pending" class="milestone pending">
        <div class="point"></div>
        <div opacity-30>
          <span block text-lg>{{ milestone.content }}</span>
          <span block text-sm text-gray-500 dark:text-truegray-400>{{ milestone.time }}</span>
        </div>
      </div>
      <!-- eslint-disable-next-line vue/require-v-for-key -->
      <div v-for="milestone in currentProject?.roadmap.done" class="milestone done">
        <div class="point"></div>
        <div>
          <span block text-lg>{{ milestone.content }}</span>
          <span block text-sm text-gray-500 dark:text-truegray-400>{{ milestone.time }}</span>
        </div>
      </div>
    </div>
  </DialogComponent>
</template>

<style lang="css" scoped>
.milestone {
  padding: 0.5rem 0 0.5rem 2rem;
  position: relative;
}

.milestone::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 50%;
  left: 1rem;
  width: 2px;
  --at-apply: bg-blue;
}
.milestone::after {
  content: '';
  position: absolute;
  top: 50%;
  bottom: 0;
  left: 1rem;
  width: 2px;
  --at-apply: bg-blue;
}

.milestone.pending::before {
  --at-apply: bg-gray-300 'dark:bg-truegray-400';
}

.milestone.pending::after {
  --at-apply: bg-gray-300 'dark:bg-truegray-400';
}

.milestone:first-of-type::before {
  --at-apply: bg-gradient-from-transparent bg-gradient-to-blue bg-gradient-linear bg-transparent;
}

.milestone:last-of-type::after {
  --at-apply: bg-gradient-from-blue bg-gradient-to-transparent bg-gradient-linear bg-transparent;
}

.milestone.pending:first-of-type::before {
  --at-apply: bg-gradient-from-transparent bg-gradient-to-gray-300
    'dark:bg-gradient-to-truegray-400' bg-gradient-linear bg-transparent;
}

.milestone.pending:last-of-type::after {
  --at-apply: bg-gradient-from-gray-300 'dark:bg-gradient-from-truegray-400'
    bg-gradient-to-transparent bg-gradient-linear bg-transparent;
}

.point {
  z-index: 1;
  position: absolute;
  height: 0.4rem;
  width: 0.4rem;
  left: calc(0.9rem - 1px);
  top: calc(50% - 0.2rem);
  border-radius: 9999px;
  --at-apply: bg-blue;
}

.pending .point {
  --at-apply: bg-gray-300 'dark:bg-truegray-400';
}
</style>
