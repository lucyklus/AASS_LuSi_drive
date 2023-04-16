export type Album = {
  id: number
  name: string
}

export type Photo = {
  id: number
  name: string
  cloudinaryLink: string
  albums: number[]
}
