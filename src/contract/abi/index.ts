import ecomInfo from './ecom-info.json'
import ecomOrder from './ecom-order.json'
import ecomProduct from './ecom-product.json'
import ecomUser from './ecom-user.json'
import abiFile from './file.json'

export const abi = { ecomInfo, ecomOrder, ecomProduct, ecomUser, abiFile }

export const toAddress = {
  ecomInfo: import.meta.env.VITE_ECOM_INFO_ADDRESS,
  ecomOrder: import.meta.env.VITE_ECOM_ORDER_ADDRESS,
  ecomProduct: import.meta.env.VITE_ECOM_PRODUCT_ADDRESS,
  ecomUser: import.meta.env.VITE_ECOM_USER_ADDRESS,
  file: import.meta.env.VITE_FILE_ADDRESS
}
