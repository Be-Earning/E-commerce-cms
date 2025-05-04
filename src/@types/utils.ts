export type Keys<T> = (keyof T)[]

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]

export type LatLng = {
  lat: number
  lng: number
}

export type VisaInfo = {
  cardNumber: string
  expirationDate: string
  cvv: string
  cardName: string
}

export type PostalCode = {
  address: {
    postcode: string
  }
}

export type IP = {
  ip: string
}

export type Payment = {
  paymentId: string
  redirectToUrl: string
  riskScore: number
}

export type CheckPayment = {
  status: number
  amount: number
}
