import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Album, Photo } from '@/types'

export const usePhotosStore = defineStore('photos', () => {
  const photos = ref<Photo[]>([])

  const albums = ref<Album[]>([])

  const savePhotos = async (_photos: Photo[]) => {
    photos.value = _photos
  }

  const loadPhotos = async (album?: number | null) => {
    try {
      if (!album && album !== 0) {
        const response = await fetch('http://localhost:3030/photos')
        const data = await response.json()
        data.forEach((photo: any) => {
          photo.albums = photo.albums.map((album: Album) => album.id)
        })
        photos.value = data
      } else {
        const response = await fetch(`http://localhost:3030/${album}/photos`)
        const data = await response.json()
        data.forEach((photo: any) => {
          photo.albums = photo.albums.map((album: Album) => album.id)
        })
        photos.value = data
      }
    } catch (err) {
      console.error(err)
    }
  }

  const loadAlbums = async () => {
    try {
      const response = await fetch('http://localhost:3030/albums')
      albums.value = await response.json()
    } catch (err) {
      console.error(err)
    }
  }

  const addAlbum = async (name: string) => {
    try {
      const response = await fetch('http://localhost:3030/album', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name
        })
      })
      const data = await response.json()
    } catch (err) {
      console.error(err)
    }
    await loadAlbums()
  }

  const uploadedFile = ref<File | null>(null)

  const setUploadedFile = (file: File | null) => {
    uploadedFile.value = file
  }

  const uploadPhoto = async (selectedFile: File) => {
    setUploadedFile(selectedFile)
    try {
      await fetch(
        'http://localhost:8080/engine-rest/process-definition/photo-uploading:1:7913add7-dfb9-11ed-82e5-0242ac110002/start',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            variables: {
              name: {
                value: selectedFile.name
              }
            }
          })
        }
      )
    } catch (err) {
      console.error(err)
    }
  }

  const editPhoto = async (id: number, name: string, albums: number[]) => {
    try {
      const response = await fetch(`http://localhost:3030/photo/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          albums
        })
      })
      const data = await response.json()
    } catch (err) {
      console.error(err)
    }
  }

  const editAlbum = async (id: number, name: string) => {
    try {
      const response = await fetch(`http://localhost:3030/album/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name
        })
      })
      const data = await response.json()
    } catch (err) {
      console.error(err)
    }
    await loadAlbums()
  }

  const deletePhoto = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3030/photo/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await response.json()
    } catch (err) {
      console.error(err)
    }
    await loadPhotos()
  }
  const deleteAlbum = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3030/album/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await response.json()
    } catch (err) {
      console.error(err)
    }
    await loadAlbums()
  }

  return {
    photos,
    loadPhotos,
    editPhoto,
    uploadPhoto,
    deletePhoto,
    loadAlbums,
    addAlbum,
    albums,
    deleteAlbum,
    editAlbum,
    uploadedFile,
    savePhotos,
    setUploadedFile
  }
})
