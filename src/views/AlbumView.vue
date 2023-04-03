<script setup lang="ts">
import MiniPhoto from '@/components/photos/MiniPhoto.vue'
import { usePhotosStore } from '@/stores/photos'
import type { Album } from '@/types'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const photosStore = usePhotosStore()
const albums = computed(() => photosStore.albums)
const photos = computed(() => photosStore.photos)

const route = useRoute()

const currentAlbum = computed<Album | undefined>(() =>
  albums.value.find((album) => album.id === Number(route.params.id))
)

onMounted(async () => {
  await photosStore.loadAlbums()
  await photosStore.loadPhotos(currentAlbum.value?.id ?? null)
})
</script>
<template>
  <h2 style="margin: 50px">Current album is: {{ currentAlbum?.name ?? 'Unknown album' }}</h2>
  <v-container>
    <v-row>
      <v-col cols="2" v-for="photo in photos" :key="photo.title">
        <mini-photo :id="photo.id" :src="photo.src" :title="photo.title" :albums="photo.albums" />
      </v-col>
    </v-row>
  </v-container>
</template>
