import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Album, Photo } from '@/types'

export const usePhotosStore = defineStore('photos', () => {
  const photos = ref<Photo[]>([])

  const albums = ref<Album[]>([])

  const setPhotos = (newPhotos: Photo[]) => {
    console.log('setPhotos', newPhotos)
    photos.value = newPhotos
  }

  const setAlbums = (newAlbums: Album[]) => {
    console.log('setAlbums', newAlbums)
    albums.value = newAlbums
  }

  const loadPhotos = async (album?: number | null) => {
    try {
      if (!album && album !== 0) {
        await fetch('http://localhost:3030/photos')
      } else {
        await fetch(`http://localhost:3030/${album}/photos`)
      }
    } catch (err) {
      console.error(err)
    }
    console.log(photos.value)
  }

  const loadAlbums = async () => {
    try {
      await fetch('http://localhost:3030/albums')
    } catch (err) {
      console.error(err)
    }
  }

  const addAlbum = async (name: string) => {
    try {
      await fetch('http://localhost:3030/album', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name
        })
      })
    } catch (err) {
      console.error(err)
    }
    await loadAlbums()
  }

  const uploadPhoto = async (selectedFile: File) => {
    const formData = new FormData()
    formData.append('upload_preset', 'lusi_drive')
    formData.append('file', selectedFile)
    try {
      const res1 = await fetch(`https://api.cloudinary.com/v1_1/lusidrive/upload`, {
        method: 'POST',
        body: formData
      })
      const data = await res1.json()
      console.log('Cloudinary upload:', data)

      await fetch('http://localhost:3030/photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: selectedFile.name,
          cloudinaryLink: data.url
        })
      })
    } catch (err) {
      console.log(err)
    }
    await loadPhotos()
  }

  const editPhoto = async (id: number, name: string, albums: number[]) => {
    try {
      await fetch(`http://localhost:3030/photo/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          albums
        })
      })
    } catch (err) {
      console.error(err)
    }
    await loadPhotos()
  }

  const editAlbum = async (id: number, name: string) => {
    try {
      await fetch(`http://localhost:3030/album/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name
        })
      })
    } catch (err) {
      console.error(err)
    }
    await loadAlbums()
  }

  const deletePhoto = async (id: number) => {
    try {
      await fetch(`http://localhost:3030/photo/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (err) {
      console.error(err)
    }
    await loadPhotos()
  }
  const deleteAlbum = async (id: number) => {
    try {
      await fetch(`http://localhost:3030/album/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
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
    setAlbums,
    setPhotos
  }
})
