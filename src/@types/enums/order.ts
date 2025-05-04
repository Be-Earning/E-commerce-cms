export enum CheckoutTypeEnum {
  RECEIVE,
  STORAGE
}

export enum TrackUserEnum {
  PAYOUT,
  SHIPPING
}

export enum PaymentTypeEnum {
  VISA,
  METANODE
}

export enum TrackActivityType {
  CART,
  WISHLIST
}

export enum OrderStatus {
  AWAITING,
  INTRANSIT,
  DELIVERED,
  CANCELLED,
  STORAGE,
  ALL
}

export enum OrderStatusFormat {
  AWAITING = 'Awaiting',
  INTRANSIT = 'In transit',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
  STORAGE = 'Storage',
  ALL = 'All'
}
