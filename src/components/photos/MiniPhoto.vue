<script setup lang="ts">
import { defineProps, ref } from 'vue'
import PhotoDetail from './PhotoDetail.vue'
defineProps<{
  id: number
  src: string
  title: string
  albums: number[]
}>()

const dialog = ref(false)
</script>

<template>
  <v-dialog v-model="dialog">
    <template v-slot:activator="{ props }">
      <v-card max-width="100%" v-bind="props">
        <v-img :src="src" height="200px" />
        <v-card-title>{{ title }}</v-card-title>
      </v-card>
    </template>
    <photo-detail :id="id" :src="src" :title="title" :albums="albums" @close="dialog = false" />
  </v-dialog>
</template>
