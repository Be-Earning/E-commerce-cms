export interface IProductFrom {
  name: string
  categoryID: number
  description: string
  isFreeShipping?: number
  shippingFee: number
  brandName: string
  warranty: string
  videoUrl?: string
  expiryTime: Date
  variantType?: string
  colorSize: {
    color: string
    size: string
  }[]
  capacities: {
    valueCapacity: number
  }[]
  prices: {
    retailPrice: number
    reward: number
    memberPrice: number
    vipPrice: number
    quantity: number
  }[]
}

export interface ICommentFrom {
  name: string
  comment: string
  commentId: string
}

export interface IFAQFrom {
  question: string
  answer: string
}
