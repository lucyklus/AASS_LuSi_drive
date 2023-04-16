import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Album, Photo } from '@/types'

export const usePhotosStore = defineStore('photos', () => {
  const photos = ref<Photo[]>([])

  const albums = ref<Album[]>([])

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
    console.log(photos.value)
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
      console.log(data)
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

      const res2 = await fetch('http://localhost:3030/photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: selectedFile.name,
          cloudinaryLink: data.url
        })
      })
      const data2 = await res2.json()
      console.log('DB upload:', data2)
    } catch (err) {
      console.log(err)
    }
    await loadPhotos()
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
      console.log(data)
    } catch (err) {
      console.error(err)
    }
  }

  return { photos, loadPhotos, editPhoto, uploadPhoto, loadAlbums, addAlbum, albums }
})
