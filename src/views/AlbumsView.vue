<script setup lang="ts">
import { usePhotosStore } from '@/stores/photos'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const photosStore = usePhotosStore()
const albums = computed(() => photosStore.albums)

const router = useRouter()

const dialog = ref<boolean>(false)
const isUploading = ref<boolean>(false)
const defaultTitle = computed(() => 'My Album ' + (albums.value.length + 1))
const title = ref<string>('')

const onAddAlbum = async () => {
  isUploading.value = true
  await photosStore.addAlbum(title.value)
  isUploading.value = false
  title.value = defaultTitle.value
  dialog.value = false
}

onMounted(async () => {
  await photosStore.loadAlbums()
  title.value = defaultTitle.value
})
</script>
<template>
  <v-container>
    <v-row>
      <v-col cols="2" v-for="album in albums" :key="album.id">
        <v-card prepend-icon="mdi-folder" @click="router.push('albums/' + album.id)">
          <template #append>
            <v-btn
              icon="mdi-delete"
              density="compact"
              color="red"
              @click.stop="photosStore.deleteAlbum(album.id)"
            />
          </template>
          <v-card-title>{{ album.name }}</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="dialog">
    <template v-slot:activator="{ props: dialogProps }">
      <v-tooltip text="Add album">
        <template #activator="{ props: tooltipProps }">
          <v-btn
            v-bind="{ ...dialogProps, ...tooltipProps }"
            id="add-album"
            :loading="isUploading"
            density="compact"
            icon="mdi-folder-plus"
            size="x-large"
            color="primary"
            @click="dialog = true"
          />
        </template>
      </v-tooltip>
    </template>
    <v-row justify="center">
      <v-card width="400">
        <v-text-field clearable single-line v-model="title"></v-text-field>
        <v-card-actions>
          <v-btn color="primary" text @click="onAddAlbum">Save</v-btn>
          <v-btn color="primary" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
  </v-dialog>
</template>
<style scoped>
#add-album {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
</style>
