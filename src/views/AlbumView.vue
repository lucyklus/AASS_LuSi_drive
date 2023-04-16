<script setup lang="ts">
import MiniPhoto from '@/components/photos/MiniPhoto.vue'
import { usePhotosStore } from '@/stores/photos'
import type { Album } from '@/types'
import { watch } from 'vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const photosStore = usePhotosStore()
const albums = computed(() => photosStore.albums)
const photos = computed(() => photosStore.photos)

watch(
  () => photos.value,
  () => {
    console.log('Photos changed')
  }
)

const route = useRoute()

const currentAlbum = computed<Album | undefined>(() => {
  const id = Number(route.params.id)
  return albums.value.find((album) => album.id === id)
})

const isLoading = ref<boolean>(true)

onMounted(async () => {
  await photosStore.loadAlbums()
  await photosStore.loadPhotos(Number(route.params.id) ?? null)
  isLoading.value = false
})
</script>
<template>
  <h2 style="margin: 30px">{{ currentAlbum?.name ?? 'Unknown album' }}</h2>
  <v-container v-if="!isLoading">
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
</template>
