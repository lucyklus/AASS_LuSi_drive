import PhotosView from '@/views/PhotosView.vue'
import AlbumsView from '@/views/AlbumsView.vue'
import AlbumView from '@/views/AlbumView.vue'
import { createRouter, createWebHistory } from 'vue-router'

export const ROUTES = [
  {
    path: '/',
    name: 'Photos',
    component: PhotosView,
    icon: 'mdi-image',
    inMenu: true,
  },
  {
    path: '/albums',
    name: 'Albums',
    component: AlbumsView,
    icon: 'mdi-folder',
    inMenu: true,
  },
  {
    path: '/albums/:id',
    name: 'Album photos',
    component: AlbumView,
    icon: 'mdi-folder',
    inMenu: false,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: ROUTES
})

export default router
