export type Album = {
  id: number;
  name: string;
}

export type Photo = {
  id: number
  src: string
  title: string,
  albums: number[]
}