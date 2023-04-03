import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Album, Photo } from '@/types'

export const usePhotosStore = defineStore('photos', () => {

  const photos = ref<Photo[]>([]); 
  
  const albums = ref<Album[]>([]);

  const loadPhotos = (album?: number | null) => {
    // TODO:

    if(album === undefined){
      for (const i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
        photos.value.push({
          id: i,
          src: `https://randomuser.me/api/portraits/lego/6.jpg`,
          title: `Photo ${i}`,
          albums: [1,2]
        })
      }
    }
    else if (album !== null){
      for (const i of [1, 2, 3, 4, 5]) {
        photos.value.push({
          id: i,
          src: `https://randomuser.me/api/portraits/lego/6.jpg`,
          title: `Photo ${i}`,
          albums: [album]
        })
      }
    }
  }

  const loadAlbums = () => {
    for(const i of [1,2,3]){
      albums.value.push({
        id: i,
        name: `Album ${i}`
      })
    }
  }

  const savePhoto = (photo: Photo) => {
    // TODO:
    console.log('savePhoto', JSON.stringify(photo));
  }

  return { photos, loadPhotos, savePhoto, loadAlbums, albums }
})
