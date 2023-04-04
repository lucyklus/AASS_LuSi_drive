<script setup lang="ts">
import MiniPhoto from '@/components/photos/MiniPhoto.vue'
import { usePhotosStore } from '@/stores/photos'
import type { Photo } from '@/types'
import { computed, onMounted } from 'vue'

const photosStore = usePhotosStore()

const photos = computed<Photo[]>(() => photosStore.photos)

onMounted(async () => {
  await photosStore.loadAlbums()
  await photosStore.loadPhotos()
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="2" v-for="photo in photos" :key="photo.title">
        <mini-photo :id="photo.id" :src="photo.src" :title="photo.title" :albums="photo.albums" />
      </v-col>
    </v-row>
  </v-container>
  <v-tooltip text="Add photo">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        id="add-photo"
        density="compact"
        icon="mdi-file-image-plus"
        size="x-large"
        color="primary"
      />
    </template>
  </v-tooltip>
</template>

<style scoped>
#add-photo {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
</style>
