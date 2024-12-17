<script setup lang="ts">
import ProjectCard from '@/components/ProjectCard.vue';
import rawProjectData from '@/data/projects.json' with {type: 'json'};
import rawActivityList from 'virtual:activity-list.json' with {type: 'json'};
import rawNewsList from 'virtual:news-list.json' with {type: 'json'};
import type { Project } from '@/data/project';
import type { Activity } from '@/data/activity';
import type { News } from '@/data/news';
import ActivityListEntry from '@/components/ActivityListEntry.vue';
import NewsListEntry from '@/components/NewsListEntry.vue';
const projects = rawProjectData as Project[];
const activities = rawActivityList as Activity[];
const news = rawNewsList as News[];
</script>

<template>
  <main>
    <div w-full md:h-screen md:grid md:grid-cols-3>
      <div flex="~ items-center justify-center col" w-full h-full m-t-24 md:m-t-0>
        <img h-48 src="../assets/lcpu-dark.svg">
        <span m-t-8 text-3xl font-semibold>北京大学 Linux 俱乐部</span>
        <span m-t-1 text-lg>Linux Club of Peking University</span>
        <!-- TODO: Dark mode switch -->
        <a href="https://github.com/lcpu-club" h-8 w-8 m-t-4><img src="../assets/github-mark.svg" h-full w-full></a>
      </div>
      <div col-span-2 p-x-6 p-y-12 md:p-x-12 overflow-auto>
        <h2>项目</h2>
        <div grid md:grid-cols-2 lg:grid-cols-3 gap-2>
          <ProjectCard v-for="project in projects" :key="project.title" :project="project" />
        </div>

        <h2 m-t-12>活动</h2>
        <div>
          <ActivityListEntry v-for="activity in activities" :key="activity.title" :activity="activity" />
        </div>
        <h2>新闻</h2>
        <div>
          <NewsListEntry v-for="_news in news" :key="_news.title" :news="_news" />
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="css" scoped></style>