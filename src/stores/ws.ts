import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usePhotosStore } from './photos'
enum SocketStatus {
  CONNECTED,
  READY,
  DISCONNECTED
}

interface WsMessage {
  type: 'server' | 'upload' | 'notification' | 'photos'
  data?: any
}

interface UploadPayload {
  upload: 'yes' | 'no'
  url?: string
}
export const useWebSocketStore = defineStore('ws', () => {
  const socketStatus = ref<SocketStatus>(SocketStatus.DISCONNECTED)

  const ws = new WebSocket('ws://localhost:3030')

  const question = ref<string | null>(null)

  ws.onopen = () => {
    socketStatus.value = SocketStatus.CONNECTED
    console.log('Connected to websocket')
  }

  ws.onmessage = (event) => {
    console.log('Message from server ', event.data)
    const message: WsMessage = JSON.parse(event.data)
    if (message.type === 'server' && message.data.ready) {
      socketStatus.value = SocketStatus.READY
      console.log('Server is ready')
      return
    }
    if (message.type === 'upload') {
      question.value = message.data.message
      return
    }
    if (message.type === 'notification') {
      console.log('Notification:', message.data.message)
      return
    }
    if (message.type === 'photos') {
      console.log('Photos:', message.data.photos)
      const photosStore = usePhotosStore()
      photosStore.savePhotos(message.data.photos)
      return
    }
  }

  ws.onclose = () => {
    socketStatus.value = SocketStatus.DISCONNECTED
    console.log('Disconnected from websocket')
  }

  const approveUpload = async () => {
    const photoStore = usePhotosStore()
    const formData = new FormData()
    formData.append('upload_preset', 'lusi_drive')
    formData.append('file', photoStore.uploadedFile as File)
    photoStore.setUploadedFile(null)
    const payload: UploadPayload = {
      upload: 'no'
    }
    try {
      const res1 = await fetch(`https://api.cloudinary.com/v1_1/lusidrive/upload`, {
        method: 'POST',
        body: formData
      })
      const data = await res1.json()
      console.log('Cloudinary upload:', data)
      payload.upload = 'yes'
      payload.url = data.url
    } catch (err) {
      console.error(err)
    }
    question.value = null
    ws.send(JSON.stringify(payload))
  }

  const rejectUpload = () => {
    question.value = null
    const payload: UploadPayload = {
      upload: 'no'
    }
    ws.send(JSON.stringify(payload))
  }

  return {
    socketStatus,
    question,
    approveUpload,
    rejectUpload
  }
})
