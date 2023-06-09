<script setup lang="ts">
import MiniPhoto from '@/components/photos/MiniPhoto.vue'
import { usePhotosStore } from '@/stores/photos'
import type { Photo } from '@/types'
import { computed, onMounted, ref } from 'vue'

const photosStore = usePhotosStore()

const photos = computed<Photo[]>(() => photosStore.photos)

onMounted(async () => {
  await photosStore.loadAlbums()
  await photosStore.loadPhotos()
})

const uploader = ref<HTMLInputElement>()

const isUploading = ref<boolean>(false)

const onFileSelected = async (payload: Event) => {
  const target = payload.target as HTMLInputElement
  const selectedFile = target.files?.item(0) ?? null
  if (!selectedFile) return
  isUploading.value = true
  await photosStore.uploadPhoto(selectedFile)
  target.value = ''
  isUploading.value = false
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="2" v-for="photo in photos" :key="photo.id">
        <mini-photo
          :id="photo.id"
          :src="photo.cloudinaryLink"
          :title="photo.name"
          :albums="photo.albums"
        />
      </v-col>
    </v-row>
  </v-container>
  <v-tooltip text="Add photo">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        id="add-photo"
        :loading="isUploading"
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
