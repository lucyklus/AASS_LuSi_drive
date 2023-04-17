<script setup lang="ts">
import MiniPhoto from '@/components/photos/MiniPhoto.vue'
import { usePhotosStore } from '@/stores/photos'
import type { Album } from '@/types'
import { watch } from 'vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const photosStore = usePhotosStore()
const photos = computed(() => photosStore.photos)
const editedTitle = ref<string>('')
const isSavable = ref(false)
const route = useRoute()

const originalAlbum = computed<Album | undefined>(() => {
  const id = Number(route.params.id)
  return photosStore.albums.find((album) => album.id === id)
})

watch([editedTitle, originalAlbum], ([newTitle, oldAlbum]) => {
  isSavable.value = newTitle !== oldAlbum?.name
})

const isLoading = ref<boolean>(true)

onMounted(async () => {
  await photosStore.loadAlbums()
  await photosStore.loadPhotos(Number(route.params.id) ?? null)
  editedTitle.value = originalAlbum.value?.name ?? 'Unknown album'
  isLoading.value = false
})
</script>
<template>
  <span class="title">
    <v-responsive max-width="344">
      <v-text-field
        v-model="editedTitle"
        variant="underlined"
        label="Title"
        :rules="[() => !!editedTitle || 'Title is required']"
      />
    </v-responsive>
    <v-btn
      :disabled="!isSavable"
      color="primary"
      text
      @click="photosStore.editAlbum(originalAlbum?.id ?? 0, editedTitle)"
    >
      Save
    </v-btn>
  </span>
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
<style scoped>
.title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 40px;
  padding-right: 40px;
}
</style>
