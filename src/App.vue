<script setup lang="ts">
import { RouterView } from 'vue-router'
import SideBar from '@/components/SideBar.vue'

import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const routeName = computed(() => route.name)
</script>

<template>
  <v-layout>
    <v-app-bar :elevation="2">
      <v-app-bar-title>LuSi Drive</v-app-bar-title>
    </v-app-bar>

    <side-bar />
    <v-main>
      <h1>{{ routeName }}</h1>
      <router-view />
    </v-main>
  </v-layout>
</template>
<style scoped>
h1 {
  margin: 30px;
}
</style>
