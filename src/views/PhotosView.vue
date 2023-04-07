<script setup lang="ts">
import MiniPhoto from '@/components/photos/MiniPhoto.vue'
import { usePhotosStore } from '@/stores/photos'
import type { Photo } from '@/types'
import { computed, onMounted, ref } from 'vue'

const photosStore = usePhotosStore()

const photos = computed<Photo[]>(() => photosStore.photos)
const cloudinaryName = 'lusidrive'
const cloudinaryPreset = 'lusi_drive'

onMounted(async () => {
  await photosStore.loadAlbums()
  await photosStore.loadPhotos()
})

const uploader = ref<HTMLInputElement>()

const selectedFile = ref<File | null>(null)

const onFileSelected = (payload: Event) => {
  selectedFile.value = (payload.target as HTMLInputElement).files?.item(0) ?? null
  // TODO: upload to cloudinary and save to db
}
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
        @click="uploader?.click()"
      />
      <input
        ref="uploader"
        style="display: none"
        type="file"
        accept="image/*"
        @change="onFileSelected"
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
