<script setup lang="ts">
import { defineProps, ref, onMounted, computed } from 'vue'
import { usePhotosStore } from '@/stores/photos'
import { useRoute } from 'vue-router'
const photosStore = usePhotosStore()
const route = useRoute()

const props = defineProps<{
  id: number
  src: string
  title: string
  albums: number[]
}>()

defineEmits(['close'])

const albums = ref<number[]>([])
const title = ref('')
const isSavable = ref(false)

const snackbar = ref(false)

const storedAlbums = computed(() => photosStore.albums)

const isChangingAlbum = ref(false)

const canAddAlbum = computed(() => {
  return albums.value.length < storedAlbums.value.length && !isChangingAlbum.value
})

onMounted(() => {
  albums.value = props.albums
  title.value = props.title
})

const removeAlbum = (id: number) => {
  albums.value = albums.value.filter((album) => album !== id)
  isSavable.value = true
}

const addAlbums = (id: number) => {
  albums.value = [...albums.value, id]
  isChangingAlbum.value = false
  isSavable.value = true
}

const savePhoto = async () => {
  await photosStore.editPhoto(props.id, title.value, albums.value)
  const albumId = Number(route?.params['id'])
  if (albumId) {
    await photosStore.loadPhotos(Number(albumId) ?? null)
  } else {
    await photosStore.loadPhotos()
  }
  snackbar.value = true
}
</script>
<template>
  <v-card style="margin: 40px">
    <v-container>
      <v-row>
        <v-col cols="6">
          <v-img :src="src" style="height: fit-content" />
        </v-col>
        <v-col cols="6">
          <v-card variant="tonal" min-height="100%">
            <span class="title">
              <v-text-field
                v-model="title"
                label="Title"
                :rules="[() => !!title || 'Title is required']"
                clearable
                single-line
                @update:model-value="isSavable = true"
              ></v-text-field>
            </span>
            <span class="albums">
              <v-chip
                v-for="albumId in albums"
                :key="albumId"
                closable
                @click:close="removeAlbum(albumId)"
              >
                {{
                  storedAlbums.find((album) => album.id === albumId)?.name ??
                  'Cannot find album with ID: ' + albumId
                }}
              </v-chip>
              <v-chip @click="isChangingAlbum = true" v-if="canAddAlbum">+</v-chip>
              <v-select
                v-else-if="isChangingAlbum"
                chips
                label="Select"
                :items="storedAlbums.filter((album) => !albums.includes(album.id))"
                item-title="name"
                item-value="id"
                variant="solo"
                @update:model-value="addAlbums"
              ></v-select>
            </span>
            <v-card-actions>
              <v-btn color="primary" text :disabled="!isSavable" @click="savePhoto">Save</v-btn>
              <v-btn color="primary" text @click="$emit('close')">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>

  <v-snackbar v-model="snackbar" :timeout="3000" color="green" rounded="pill">
    <p class="text-center">Changes saved</p>
    <template v-slot:actions />
  </v-snackbar>
</template>
<style>
.albums {
  display: flex;
  flex-wrap: wrap;
  margin: 10px;
  gap: 10px;
}
</style>
