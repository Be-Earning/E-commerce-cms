import { CheckoutTypeEnum, OrderStatus, PaymentTypeEnum } from '../enums'
import { IProductInOrder } from './product'

export interface ICustomerDetail {
  info: ICustomerInfor
  addresses: {
    country: string
    city: string
    state: string
    postalCode: string
    detailAddress: string
  }[]
}

export interface ICustomerInfor {
  id: string
  createdAt: string
  dateOfBirth: string
  email: string
  fullName: string
  gender: string
  image: string
  phoneNumber: string
  role: string
  user: string
  purchases: number
}
export interface ICustomer {
  addresses: string[]
  info: ICustomerInfor
}

export interface ICustomerPurchases {
  _orders: IOrderInPurchases[]
  _cart: ICartInPurchases
  _productIds: { createdAt: string; productID: string }[]
}

export interface IOrderInPurchases {
  orderID: string
  user: string
  buyer: string
  retailer: string
  discountID: string
  productIds: string[]
  variantIds: string[]
  quantities: string[]
  prices: string[]
  cartItemIds: string[]
  totalPrice: string
  checkoutType: CheckoutTypeEnum
  orderStatus: OrderStatus
  codeRef: string
  shippingPrice: string
  paymentType: PaymentTypeEnum
  createdAt: string
  products: IProductInOrder[]
}

export interface ICartInPurchases {
  id: string
  owner: string
  items: {
    id: string
    productID: string
    quantity: string
    variantID: string
  }[]
}
