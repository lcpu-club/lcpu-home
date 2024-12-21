<script setup lang="ts">
import AutoDarkImage from '@/components/AutoDarkImage.vue';

import LcpuDark from '../assets/404-dark.svg';
import LcpuLight from '../assets/404-light.svg';
import { useTitle } from '@vueuse/core';

useTitle('404 NOT FOUND | LCPU')
</script>

<template>
  <div flex="~ col items-center" m-t-24>
    <AutoDarkImage h-36 :src="LcpuDark" :src-dark="LcpuLight" />
    <h1>404 NOT FOUND!</h1>
    <p m-0 text-lg>Country roads, take me home. </p>
    <p m-0 text-lg>To the place, I belong.</p>
    <a m-t-6 p-x-6 p-y-3 rounded-full bg-black dark:bg-white decoration-none class="text-white dark:text-black"
      href=" /">Go
      Home</a>
  </div>
</template>
