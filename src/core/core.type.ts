export interface CoreResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface Seed {
  address: string
  listSeed: string[]
}
