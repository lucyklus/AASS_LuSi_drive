<script setup lang="ts">
import { usePhotosStore } from '@/stores/photos'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const photosStore = usePhotosStore()
const albums = computed(() => photosStore.albums)

const router = useRouter()

onMounted(async () => {
  await photosStore.loadAlbums()
})
</script>
<template>
  <v-container>
    <v-row>
      <v-col cols="2" v-for="album in albums" :key="album.id">
        <v-card prepend-icon="mdi-folder" @click="router.push('albums/' + album.id)">
          <v-card-title>{{ album.name }}</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-tooltip text="Add album">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        id="add-album"
        density="compact"
        icon="mdi-folder-plus"
        size="x-large"
        color="primary"
      />
    </template>
  </v-tooltip>
</template>
<style scoped>
#add-album {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
</style>
