<script setup lang="ts">
import { ROUTES } from '@/router'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
const currentPath = computed(() => route.path)
</script>
<template>
  <v-navigation-drawer expand-on-hover rail>
    <v-list>
      <v-list-item
        prepend-avatar="https://randomuser.me/api/portraits/lego/6.jpg"
        title="Test User"
        subtitle="test_user@gmail.com"
      ></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item
        v-for="route in ROUTES.filter((route) => route.inMenu)"
        :key="route.path"
        :active="currentPath === route.path"
        :title="route.name"
        :value="route.path"
        :prepend-icon="route.icon"
        @click="router.push(route.path)"
      />
    </v-list>
  </v-navigation-drawer>
</template>
