import { ICommentFrom, IFAQFrom } from './form'

export interface ImageUploadSingle {
  dir: string
  file: Blob
}

export interface ImageUpload {
  dir: string
  files: Blob
}

export interface ImageRes {
  failed_files: string[] | null
  uploaded_urls: string[]
}

export interface IProductCreate {
  params: IProductParams
  _variants: IProductVariantsCreate[]
}

export interface IProductUpdate extends IProductCreate {
  _productID: number
}

export interface IProductVariantsCreate {
  variantID: string
  attrs: IProductAttrs[]
  priceOptions: IProductPriceOptions
}

export interface ColorSize {
  color: string
  size: string
}

export interface Capacity {
  valueCapacity: string
}

export interface IProductInOrder {
  desc: string
  imgUrl: number
  price: string
  retailPrice: number
  boostTime: string
  quantity: string
  tokens: string[]
}

export interface IProductParams {
  name: string
  categoryID: number
  description: string
  retailPrice: string
  vipPrice: string
  memberPrice: string
  reward: number
  quantity: number
  shippingFee: string
  capacity: number[]
  size: string[]
  color: string[]
  retailer: string
  brandName: string
  warranty: string
  isFlashSale: boolean
  images: string[]
  videoUrl: string
  isApprove: boolean
  sold: number
  boostTime: number
  expiryTime: number
  activateTime: number
  isMultipleDiscount: boolean
  fileKey?: string[]
}

export interface IProductAttrs {
  id: string
  key: string
  value: string
}
export interface IProductVariant {
  variantID: string
  priceOptions: IProductPriceOptions
}

export interface IProductPriceOptions {
  retailPrice: string
  vipPrice: string
  memberPrice: string
  reward: number
  quantity: number
}

export interface IProductDetail {
  _comments: ICommentProductDetail[]
  _rating: RatingProduct
  _rates: string[]
  _faqs: IFAQProductDetail[]
  _productPurchaseTrend: string[]
  _productTrend: string[]
}

export interface IProductBestSeller {
  productID: string
  sold: string
  timestamp: string
}

export interface IProductViewCount {
  _productIds: string[]
  _productCount: string[]
  _time: string[]
}

export interface ICommentProduct extends ICommentFrom {
  id: number
  rating: number
  isNew: boolean
}

export interface IFAQProduct extends IFAQFrom {
  id: number
  isNew: boolean
}

export interface IFAQProductDetail {
  content: string
  id: string
  title: string
}

export interface ICommentProductDetail {
  commentType: string
  createdAt: string
  id: string
  message: string
  name: string
  productID: string
  updatedAt: string
  user: string
}

export interface RatingProduct {
  id: string
  user: string
  rateValue: string
  createdAt: string
}

export interface Product {
  id: string
  params: {
    activateTime: string
    boostTime: string
    brandName: string
    capacity: string[]
    categoryID: string
    color: string[]
    description: string
    expiryTime: string
    images: string[]
    isApprove: boolean
    isFlashSale: boolean
    isMultipleDiscount: boolean
    memberPrice: string
    name: string
    quantity: string
    retailPrice: string
    retailer: string
    reward: string
    shippingFee: string
    size: string[]
    sold: string
    videoUrl: string
    vipPrice: string
    warranty: string
    fileKey?: string[]
  }
  createdAt: string
  updatedAt: string
}

export interface IProductAttrs {
  id: string
  key: string
  value: string
}

export interface IProductPriceOption {
  retailPrice: string
  vipPrice: string
  memberPrice: string
  reward: string
  quantity: string
}

export interface IProductVariant {
  variantID: string
  priceOptions: IProductPriceOptions
}

export interface ProductInfo {
  product: Product
  attributes: IProductAttrs[][]
  variants: IProductVariant[]
  productCount?: number
  sold?: number
  timestamp?: number
  quantityInOrder?: number
  priceInOrder?: number
  variant?: IProductVariant
  attribute?: IProductAttrs[]
}
