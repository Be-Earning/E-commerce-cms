import { CheckoutTypeEnum, OrderStatus, PaymentTypeEnum } from '../enums'
import { IProductInOrder, ProductInfo } from './product'

export type IOrder = {
  id?: string
  orderID: string
  user: string
  buyer: string
  discountID: number
  cartItemIds: string[]
  productIds: string[]
  variantIds: string[]
  quantities: string[]
  diffPrices: string[]
  prices: string[]
  rewards: string[]
  totalPrice: string
  checkoutType: CheckoutTypeEnum
  orderStatus: OrderStatus
  codeRef: string
  shippingPrice: string
  paymentType: PaymentTypeEnum
  createdAt: string
  products: IProductInOrder[]
  productDetails: ProductInfo[]
}
