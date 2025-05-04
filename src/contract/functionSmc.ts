import {
  ICategory,
  ICustomerDetail,
  ICustomerInfor,
  IOrder,
  IProductBestSeller,
  IProductDetail,
  IProductViewCount,
  ISystemInfo,
  ProductInfo
} from '~/@types/models'
import { sendSMC } from './sendSMC'

export const getBrands = async () => {
  return await sendSMC<string[]>({
    feeType: 'read',
    abiType: 'ecomProduct',
    functionName: 'getBrands'
  })
}

export const getCategories = async () => {
  return await sendSMC<ICategory[]>({
    feeType: 'read',
    abiType: 'ecomProduct',
    functionName: 'getCategories'
  })
}

export const getTotalProductViewCount = async (from: string) => {
  return await sendSMC<IProductViewCount>({
    from,
    feeType: 'read',
    abiType: 'ecomInfo',
    functionName: 'getTotalProductViewCount'
  })
}

export const getBestSeller = async () => {
  return await sendSMC<IProductBestSeller[]>({
    feeType: 'read',
    abiType: 'ecomInfo',
    functionName: 'getBestSeller'
  })
}

export const getAllProductInfo = async () => {
  return await sendSMC<{ productsInfo: ProductInfo[] }>({
    feeType: 'read',
    abiType: 'ecomProduct',
    functionName: 'getAllProductInfo'
  })
}

export const getAllRetailerProductInfo = async (from: string, _retailer: string) => {
  return await sendSMC<{ productsInfo: ProductInfo[] }>({
    from,
    feeType: 'read',
    abiType: 'ecomProduct',
    functionName: 'getAllRetailerProductInfo',
    inputData: { _retailer }
  })
}

export const getProductDetails = async (_productID: number) => {
  return await sendSMC<IProductDetail>({
    feeType: 'read',
    abiType: 'ecomProduct',
    functionName: 'getProductDetails',
    inputData: { _productID }
  })
}

export const adminRejectProduct = async (from: string, _productID: number) => {
  return await sendSMC<boolean>({
    from,
    abiType: 'ecomProduct',
    functionName: 'adminRejectProduct',
    inputData: { _productID }
  })
}

export const adminAcceptProduct = async (from: string, _productID: number) => {
  return await sendSMC<boolean>({
    from,
    abiType: 'ecomProduct',
    functionName: 'adminAcceptProduct',
    inputData: { _productID }
  })
}

export const deleteProduct = async (from: string, _productID: number) => {
  return await sendSMC<boolean>({
    from,
    abiType: 'ecomProduct',
    functionName: 'deleteProduct',
    inputData: { _productID }
  })
}

export const getOrders = async (from: string) => {
  return await sendSMC<{ res: IOrder[] }>({
    from,
    feeType: 'read',
    abiType: 'ecomOrder',
    functionName: 'getOrders'
  })
}

export const RetailerChangeOrderStatus = async (
  from: string,
  inputData: { _orderID: number; _orderStatus: number }
) => {
  return await sendSMC<boolean>({
    from,
    abiType: 'ecomOrder',
    functionName: 'RetailerChangeOrderStatus',
    inputData
  })
}

export const getUsersInfo = async (from: string) => {
  return await sendSMC<{ infos: ICustomerInfor[]; purchases: number }>({
    from,
    feeType: 'read',
    abiType: 'ecomUser',
    functionName: 'getUsersInfo'
  })
}

export const getUserInfo = async (from: string, userAddress: string) => {
  return await sendSMC<ICustomerDetail>({
    from,
    feeType: 'read',
    abiType: 'ecomUser',
    functionName: 'getUserInfo',
    inputData: { _user: userAddress }
  })
}

export const getUserPurchaseInfo = async (from: string, customerAddress: string) => {
  return await sendSMC<any>({
    from,
    feeType: 'read',
    abiType: 'ecomInfo',
    functionName: 'getUserPurchaseInfo',
    inputData: { _user: customerAddress }
  })
}

export interface IGetFileInfoOutput {
  owner: string
  hash: string
  contentLen: number
  totalChunks: number
  expireTime: number
  name: string
  ext: string
  status: number
  contentDisposition: string
  contentID: string
}

export const getFilesInfo = async (from: string, fileKeys: string[]) => {
  return await sendSMC<{ infos: IGetFileInfoOutput[] }>({
    from,
    feeType: 'read',
    abiType: 'abiFile',
    functionName: 'getFilesInfo',
    inputData: { fileKeys }
  })
}

export interface IDownloadFile {
  fileKey: string
  start: number
  limit: number
}

export const downloadFile = async (from: string, inputData: IDownloadFile) => {
  return await sendSMC<string[]>({
    from,
    feeType: 'read',
    abiType: 'abiFile',
    functionName: 'downloadFile',
    inputData
  })
}

export const getSystemInfo = async (from: string) => {
  return await sendSMC<ISystemInfo>({
    from,
    feeType: 'read',
    abiType: 'ecomInfo',
    functionName: 'getSystemInfo'
  })
}

export const getUserRole = async (from: string) => {
  return await sendSMC<string>({
    from,
    feeType: 'read',
    abiType: 'ecomUser',
    functionName: 'getUserRole',
    inputData: { _user: from }
  })
}

export const mController = async (from: string) => {
  return await sendSMC<boolean>({
    from,
    feeType: 'read',
    abiType: 'ecomProduct',
    functionName: 'mController',
    inputData: { '': from }
  })
}

export interface IPushFileInfoInput {
  owner: string
  hash: string
  contentLen: number
  totalChunks: number
  expireTime: number
  name: string
  ext: string
  status: number
  contentDisposition: string
  contentID: string
}

export const pushFileInfos = async (from: string, infos: IPushFileInfoInput) => {
  return await sendSMC<{ fileKey: string }>({
    from,
    abiType: 'abiFile',
    functionName: 'pushFileInfos',
    inputData: { infos }
  })
}

export const getFileKeyFromName = async (from: string, names: string[]) => {
  return await sendSMC<string[]>({
    from,
    feeType: 'read',
    abiType: 'abiFile',
    functionName: 'getFileKeyFromName',
    inputData: { names }
  })
}

export const uploadChunks = async (
  from: string,
  inputData: { fileKey: string; chunkDatas: string[]; chunkHashes: string[] }
) => {
  return await sendSMC<boolean>({
    from,
    abiType: 'abiFile',
    functionName: 'uploadChunks',
    inputData,
    gas: 200000
  })
}
