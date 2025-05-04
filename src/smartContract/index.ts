import { abi } from './abi'

export const abiEcomInfo = {
  abiAddress: import.meta.env.VITE_ECOM_INFO_ADDRESS,
  abi: abi.EcomInfo
}

export const abiEcomOrder = {
  abiAddress: import.meta.env.VITE_ECOM_ORDER_ADDRESS,
  abi: abi.EcomOrder
}

export const abiEcomProduct = {
  abiAddress: import.meta.env.VITE_ECOM_PRODUCT_ADDRESS,
  abi: abi.EcomProduct
}

export const abiEcomUser = {
  abiAddress: import.meta.env.VITE_ECOM_USER_ADDRESS,
  abi: abi.EcomUser
}

export const abiFile = {
  abiAddress: import.meta.env.VITE_ADDRESS_FILE,
  abi: abi.abiFile
}
