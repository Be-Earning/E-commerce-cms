import { ICustomerInfor } from './customer'
import { IProductAttrs } from './product'

export interface IProductTable {
  id: string
  productName: string
  categoryID: string
  createdAt: string
  imported: number
  sold: string
  left: number
  status: string
  isFlashSale: boolean
  attributes: IProductAttrs[][]
  variants: {
    variantID: string
    priceOptions: {
      memberPrice: string
      quantity: number
      retailPrice: string
      reward: number
      vipPrice: string
    }
  }[]
  vipPrice: string
  retailer: string
  images: string[]
}

export interface ICustomerTable extends ICustomerInfor {
  id: string
}

export interface IAgentTable extends ICustomerInfor {
  productPosted: number
  productSold: number
}
