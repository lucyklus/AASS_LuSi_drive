import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usePhotosStore } from './photos'
import type { Album, Photo } from '@/types'
enum SocketStatus {
  CONNECTED,
  READY,
  DISCONNECTED
}

type EntityType = 'albums' | 'photos'

interface WsMessage {
  type: EntityType
  data: any
}

export const useWebSocketStore = defineStore('ws', () => {
  const socketStatus = ref<SocketStatus>(SocketStatus.DISCONNECTED)
  const photosStore = usePhotosStore()

  let ws: WebSocket | null = null

  const connect = async () => {
    ws = new WebSocket('ws://localhost:3030')

    ws.onopen = () => {
      socketStatus.value = SocketStatus.CONNECTED
      console.log('Connected to websocket')
    }

    ws.onmessage = (event) => {
      console.log('Message from server ', event.data)
      const entity: WsMessage = JSON.parse(event.data)
      if (entity.type === 'albums') {
        photosStore.setAlbums(entity.data as Album[])
      } else if (entity.type === 'photos') {
        const photos = []
        for (const photo of entity.data) {
          photos.push({ ...photo, albums: photo.albums.map((album: Album) => album.id) })
        }
        photosStore.setPhotos(photos)
      }
    }

    ws.onclose = () => {
      socketStatus.value = SocketStatus.DISCONNECTED
      console.log('Disconnected from websocket')
    }
  }
  return {
    socketStatus,
    connect
  }
})
