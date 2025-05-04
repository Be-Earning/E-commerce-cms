import { CheckoutTypeEnum, OrderStatus, OrderStatusFormat, PaymentTypeEnum } from '~/@types/enums'
import { ListProductTypeFormat } from '~/@types/enums/list'
import { IOrder } from '~/@types/models'

export const ConvertStatus = (status: string | number) => {
  switch (status) {
    case 0:
      return {
        status: OrderStatusFormat.AWAITING,
        className: 'bg-blue-main/[.12] text-blue-dark'
      }
    case 1:
      return {
        status: OrderStatusFormat.INTRANSIT,
        className: 'bg-orange-intransit text-orange-main'
      }
    case 2:
      return {
        status: OrderStatusFormat.DELIVERED,
        className: 'bg-green-delivered text-green-light1'
      }
    case 3:
      return {
        status: OrderStatusFormat.CANCELLED,
        className: 'bg-red-cancel text-red-main'
      }
    case 4:
      return {
        status: OrderStatusFormat.STORAGE,
        className: 'bg-purple-storage text-purple-main'
      }
    case 5:
      return {
        status: OrderStatusFormat.ALL,
        className: 'bg-gray-500'
      }
    case 'Approve':
      return {
        className: 'bg-green-delivered'
      }
    case 'Pending':
      return {
        className: 'bg-orange-intransit'
      }
    default:
      return {
        status: 'Unknown',
        className: 'bg-gray-300'
      }
  }
}

export const ConverCategory = (category: string) => {
  switch (category) {
    case '1':
      return 'health'
    case '2':
      return 'cosmetic'
    case '3':
      return 'fashion'
    case '4':
      return 'food'
    case '5':
      return 'digital'
    default:
      return 'Unknown'
  }
}

export const ConverStatusToString = (status: number) => {
  switch (status) {
    case 0:
      return OrderStatusFormat.AWAITING
    case 1:
      return OrderStatusFormat.INTRANSIT
    case 2:
      return OrderStatusFormat.DELIVERED
    case 3:
      return OrderStatusFormat.CANCELLED
    case 4:
      return OrderStatusFormat.STORAGE
    case 5:
      return OrderStatusFormat.ALL
    case 6:
      return ListProductTypeFormat.PURCHASE
    case 7:
      return ListProductTypeFormat.CART
    case 8:
      return ListProductTypeFormat.WISHLIST
    case 9:
      return ListProductTypeFormat.POSTED
    default:
      return 'Unknown'
  }
}

export const ConverPaymentToString = (status: number) => {
  switch (status) {
    case PaymentTypeEnum.VISA:
      return 'Visa'
    case PaymentTypeEnum.METANODE:
      return 'Metanode'
    default:
      return 'Unknown'
  }
}

export const calculateTotalCount = (listOrders: IOrder[], status: OrderStatus) => {
  if (status === OrderStatus.STORAGE) {
    return listOrders.filter((order) => +order.checkoutType === CheckoutTypeEnum.STORAGE).length
  }

  return listOrders.filter((order) => +order.orderStatus === status && +order.checkoutType === CheckoutTypeEnum.RECEIVE)
    .length
}
