<script setup lang="ts">
import { defineProps, ref, onMounted, computed } from 'vue'
import { usePhotosStore } from '@/stores/photos'
const photosStore = usePhotosStore()

const props = defineProps<{
  id: number
  src: string
  title: string
  albums: number[]
}>()

defineEmits(['close'])

const _albums = ref<number[]>([])
const _title = ref('')
const isSavable = ref(false)

const snackbar = ref(false)

const storedAlbums = computed(() => photosStore.albums)

onMounted(() => {
  _albums.value = props.albums
  _title.value = props.title
})

const addAlbum = () => {
  // TODO
  console.log('add album')
  isSavable.value = true
}

const removeAlbum = (id: number) => {
  _albums.value = _albums.value.filter((album) => album !== id)
  isSavable.value = true
}

const savePhoto = async () => {
  await photosStore.savePhoto({
    id: props.id,
    src: props.src,
    title: _title.value,
    albums: _albums.value
  })
  snackbar.value = true
}
</script>
<template>
  <v-card style="margin: 40px">
    <v-container>
      <v-row>
        <v-col cols="6">
          <v-img :src="src" />
        </v-col>
        <v-col cols="6">
          <v-card variant="tonal" min-height="100%">
            <v-card-title>{{ _title }}</v-card-title>
            <span class="albums">
              <v-chip
                v-for="albumId in _albums"
                :key="albumId"
                closable
                @click:close="removeAlbum(albumId)"
              >
                {{
                  storedAlbums.find((album) => album.id === albumId)?.name ?? 'Cannot find album'
                }}
              </v-chip>
              <v-chip @click="addAlbum">+</v-chip>
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

  <v-snackbar v-model="snackbar">
    Changes saved
    <template v-slot:actions>
      <v-btn color="pink" variant="text" @click="snackbar = false"> Close </v-btn>
    </template>
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
