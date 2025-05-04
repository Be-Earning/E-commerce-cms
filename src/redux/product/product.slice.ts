import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { isEmpty } from 'lodash'
import toast from 'react-hot-toast'
import {
  ICommentProduct,
  IFAQProduct,
  IProductBestSeller,
  IProductCreate,
  IProductViewCount,
  ProductInfo
} from '~/@types/models'
import { LOCAL_STORAGE } from '~/constants/localStorage'
import { idDefault } from '~/constants/urlRegex'
import { sendTransaction } from '~/smartContract/combineSdk'
import { getLocalStorage, removeLocalStorage, setLocalStorage } from '~/utils/localStorage'
import { RootState } from '../configStore'
import { EnumCategory } from '~/@types/enums/category'
import { handleMessageError } from '~/utils/convert'
import { isBytes32 } from '~/utils/format'
import {
  getAllProductInfo,
  getAllRetailerProductInfo,
  getBestSeller,
  getTotalProductViewCount
} from '~/contract/functionSmc'

interface IinitialState {
  isLoading: boolean
  isEditing: boolean
  isEditingProduct: boolean
  listProducts: ProductInfo[]
  reviews: ICommentProduct[]
  comments: ICommentProduct[]
  faqs: IFAQProduct[]
  productReview: IProductCreate | null
  listBestSeller: IProductBestSeller[]
  listProductViewCount: IProductViewCount
}

const initialState: IinitialState = {
  isLoading: false,
  isEditing: false,
  isEditingProduct: getLocalStorage(LOCAL_STORAGE.IS_EDIT_PRODUCT) === 'false' ? false : true || false,
  listProducts: getLocalStorage(LOCAL_STORAGE.LIST_PRODUCTS) || [],
  reviews: getLocalStorage(LOCAL_STORAGE.REVIEWS) || [],
  comments: getLocalStorage(LOCAL_STORAGE.COMMENTS) || [],
  faqs: getLocalStorage(LOCAL_STORAGE.FAQS) || [],
  productReview: getLocalStorage(LOCAL_STORAGE.PRODUCT_REVIEW) || null,
  listBestSeller: getLocalStorage(LOCAL_STORAGE.LIST_BEST_SELLER) || [],
  listProductViewCount: getLocalStorage(LOCAL_STORAGE.LIST_PRODUCT_VIEW_COUNT) || {
    _productIds: [],
    _productCount: [],
    _time: []
  }
}

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProductReview(state, action: PayloadAction<IProductCreate>) {
      setLocalStorage(LOCAL_STORAGE.PRODUCT_REVIEW, action.payload)
      return { ...state, productReview: action.payload }
    },
    setListProducts(state, action) {
      return { ...state, listProducts: action.payload }
    },
    setEditing(state, action: PayloadAction<boolean>) {
      state.isEditing = action.payload
    },
    setEditingProduct(state, action: PayloadAction<boolean>) {
      state.isEditingProduct = action.payload
      setLocalStorage(LOCAL_STORAGE.IS_EDIT_PRODUCT, action.payload)
    },
    setListComments(state, action: PayloadAction<ICommentProduct[]>) {
      state.comments = action.payload
      setLocalStorage(LOCAL_STORAGE.COMMENTS, state.comments)
    },
    addNewComment(state, action: PayloadAction<ICommentProduct>) {
      state.comments.push(action.payload)
      // state.comments.sort((a, b) => a.id - b.id)
      setLocalStorage(LOCAL_STORAGE.COMMENTS, state.comments)
    },
    updateComment(state, action: PayloadAction<ICommentProduct>) {
      const index = state.comments.findIndex((comment) => comment.id === action.payload.id)
      if (index !== -1) state.comments[index] = { ...state.comments[index], ...action.payload }
      setLocalStorage(LOCAL_STORAGE.COMMENTS, state.comments)
    },
    deleteComment(state, action: PayloadAction<number>) {
      const deleteIndex = state.comments.findIndex((comment) => comment.id === action.payload)
      if (deleteIndex !== -1) {
        state.comments.splice(deleteIndex, 1)
        state.comments.forEach((comment, index) => {
          comment.id = index + 1
        })
        setLocalStorage(LOCAL_STORAGE.COMMENTS, state.comments)
      }
    },
    setListReviews(state, action: PayloadAction<ICommentProduct[]>) {
      state.reviews = action.payload
      setLocalStorage(LOCAL_STORAGE.REVIEWS, state.reviews)
    },
    addNewReview(state, action: PayloadAction<ICommentProduct>) {
      state.reviews.push(action.payload)
      // state.reviews.sort((a, b) => a.id - b.id)
      setLocalStorage(LOCAL_STORAGE.REVIEWS, state.reviews)
    },
    updateReview(state, action: PayloadAction<ICommentProduct>) {
      const index = state.reviews.findIndex((comment) => comment.id === action.payload.id)
      if (index !== -1) state.reviews[index] = { ...state.reviews[index], ...action.payload }
      setLocalStorage(LOCAL_STORAGE.REVIEWS, state.reviews)
    },
    deleteReview(state, action: PayloadAction<number>) {
      console.log('action', action)
      const deleteIndex = state.reviews.findIndex((review) => review.id === action.payload)
      if (deleteIndex !== -1) {
        state.reviews.splice(deleteIndex, 1)
        state.reviews.forEach((review, index) => {
          review.id = index + 1
        })
        setLocalStorage(LOCAL_STORAGE.REVIEWS, state.reviews)
      }
    },
    setListFAQs(state, action: PayloadAction<IFAQProduct[]>) {
      state.faqs = action.payload
      setLocalStorage(LOCAL_STORAGE.FAQS, state.faqs)
    },
    addNewFAQ(state, action: PayloadAction<IFAQProduct>) {
      state.faqs.push(action.payload)
      // state.faqs.sort((a, b) => a.id - b.id)
      setLocalStorage(LOCAL_STORAGE.FAQS, state.faqs)
    },
    updateFAQ(state, action: PayloadAction<IFAQProduct>) {
      const index = state.faqs.findIndex((review) => review.id === action.payload.id)
      if (index !== -1) state.faqs[index] = { ...state.faqs[index], ...action.payload }
      setLocalStorage(LOCAL_STORAGE.FAQS, state.faqs)
    },
    deleteFAQ(state, action: PayloadAction<number>) {
      const deleteIndex = state.faqs.findIndex((faq) => faq.id === action.payload)
      if (deleteIndex !== -1) {
        state.faqs.splice(deleteIndex, 1)
        state.faqs.forEach((faq, index) => {
          faq.id = index + 1
        })
        setLocalStorage(LOCAL_STORAGE.FAQS, state.faqs)
      }
    },
    clearProductReview(state) {
      state.comments = []
      state.reviews = []
      state.faqs = []
      state.productReview = null
      removeLocalStorage(LOCAL_STORAGE.FAQS)
      removeLocalStorage(LOCAL_STORAGE.REVIEWS)
      removeLocalStorage(LOCAL_STORAGE.COMMENTS)
      removeLocalStorage(LOCAL_STORAGE.PRODUCT_REVIEW)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getListProducts.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getListProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.listProducts =
          action.payload === false ? getLocalStorage(LOCAL_STORAGE.LIST_PRODUCTS) || [] : action.payload
      })
      .addCase(getListProducts.rejected, (state) => {
        state.isLoading = false
        state.listProducts = []
      })
      .addCase(getListProductsRetailer.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getListProductsRetailer.fulfilled, (state, action) => {
        state.isLoading = false
        state.listProducts =
          action.payload === false ? getLocalStorage(LOCAL_STORAGE.LIST_PRODUCTS) || [] : action.payload
      })
      .addCase(getListProductsRetailer.rejected, (state) => {
        state.isLoading = false
        state.listProducts = []
      })
      .addCase(fetchBestSellter.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchBestSellter.fulfilled, (state, action) => {
        state.isLoading = false
        state.listBestSeller =
          action.payload === false ? getLocalStorage(LOCAL_STORAGE.LIST_BEST_SELLER) || [] : action.payload
      })
      .addCase(fetchBestSellter.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(fetchListProductViewCount.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchListProductViewCount.fulfilled, (state, action) => {
        state.isLoading = false
        state.listProductViewCount =
          action.payload === false ? getLocalStorage(LOCAL_STORAGE.LIST_PRODUCT_VIEW_COUNT) || [] : action.payload
      })
      .addCase(fetchListProductViewCount.rejected, (state) => {
        state.isLoading = false
      })
  }
})

export const {
  setListProducts,
  setEditing,
  addNewComment,
  updateComment,
  deleteComment,
  addNewReview,
  updateReview,
  deleteReview,
  addNewFAQ,
  updateFAQ,
  deleteFAQ,
  setProductReview,
  setEditingProduct,
  clearProductReview,
  setListComments,
  setListReviews,
  setListFAQs
} = productSlice.actions
const productReducer = productSlice.reducer

export default productReducer

export const convertBlobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result) // Trả về chuỗi Base64
      } else {
        reject(new Error('Failed to convert Blob to Base64'))
      }
    }

    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(blob) // Đọc Blob dưới dạng Base64
  })
}

export const isHexString = (str: string): boolean => {
  const hexRegex = /^[0-9A-Fa-f]+$/

  // Check if the string matches the hex pattern and if the length is even
  return hexRegex.test(str) && str.length % 2 === 0
}
export const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff']

const handleGetFile = async (from: string, fileKeys: string[]) => {
  try {
    const filesData = await sendTransaction('getFilesInfo', { fileKeys: fileKeys }, 'file', from, 'chain', 'read')
    console.log('handleGetFile---getFilesInfo', filesData)
    if (!filesData.success || !Array.isArray(filesData.data.infos)) return []
    const limit = 10
    const imageCache = new Map<string, string>()

    const fileChunksPromises = fileKeys.map(async (fileKey, index) => {
      if (!isHexString(fileKey) || fileKey.length !== 64) return fileKey

      if (imageCache.has(fileKey)) {
        return imageCache.get(fileKey) as string
      }

      const file = filesData.data.infos[index]
      if (!file) return fileKey

      const { totalChunks, ext, name } = file

      const extension = ext?.toLowerCase()
      const fileName = name?.toLowerCase()
      if (!imageExtensions.includes(extension) && !imageExtensions.some((ext) => fileName?.endsWith(`.${ext}`))) {
        return fileKey
      }

      const chunkIndexes = Array.from({ length: Math.ceil(totalChunks / limit) }, (_, i) => i * limit)
      const chunkPromises = chunkIndexes.map(async (start) => {
        try {
          return (await sendTransaction('downloadFile', { fileKey, start, limit }, 'file', from, 'chain', 'read')).data
        } catch (chunkError: any) {
          console.error(chunkError)
          console.log('chunkError', chunkError)
          return [] // Tránh crash khi lỗi tải chunk
        }
      })
      const fileChunks = await Promise.all(chunkPromises)
      const fileContent = fileChunks.flat().join('')
      if (!fileContent) return fileKey
      const imageUrl = bytesToImageUrl(fileContent)?.blob
      console.log('imageUrl ==>', imageUrl)

      let base64Image = fileKey // Mặc định giữ nguyên nếu lỗi
      if (imageUrl instanceof Blob) {
        base64Image = await convertBlobToBase64(imageUrl)
      }

      imageCache.set(fileKey, base64Image)
      return base64Image
    })
    return await Promise.all(fileChunksPromises)
  } catch (error) {
    toast.error(handleMessageError(error))
    return []
  }
}

export const bytesToImageUrl = (hexString: string) => {
  if (!hexString) {
    throw new Error('Hex string cannot be empty')
  }

  const byteArray = new Uint8Array(hexString.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) ?? [])

  const blob = new Blob([byteArray], { type: 'image/png' })
  const imageUrl = URL.createObjectURL(blob)

  return {
    byteArray,
    blob,
    imageUrl
  }
}

export const getListProducts = createAsyncThunk('products/fetchProducts', async (_, { getState }) => {
  try {
    const state = getState() as RootState
    let res = await getAllProductInfo()
    if (!res.success) return false
    console.log('getAllProductInfo', res.data.productsInfo)
    const listProductsSC = res.data.productsInfo.map((product: ProductInfo) => {
      return {
        ...product,
        attributes:
          product.product.params.categoryID === EnumCategory.DIGITAL ||
          product.attributes.filter((attris) => attris.length > 0).length === 0
            ? [[]]
            : product.attributes
                .filter((attris) => attris.length > 0)
                .map((subAttris) => subAttris.filter((item) => item.id !== idDefault)),
        variants: product.variants.filter((vari) => vari.variantID !== idDefault)
      }
    })
    const allFileKeys = new Set<string>()
    listProductsSC.forEach((product) => {
      product.product.params.images.forEach((image) => {
        if (isBytes32(image)) {
          allFileKeys.add(image)
        }
      })
    })

    const fileKeysArray = Array.from(allFileKeys)
    if (fileKeysArray.length > 0) {
      const base64Images = await handleGetFile(state.user.activeWallet, fileKeysArray)
      console.log('base64Images list', base64Images)
      listProductsSC.forEach((product) => {
        product.product.params.fileKey = product.product.params.images.map((image) => {
          const index = fileKeysArray.indexOf(image)
          return fileKeysArray[index]
        })
        product.product.params.images = product.product.params.images.map((image) => {
          const index = fileKeysArray.indexOf(image)
          return isBytes32(image) && base64Images[index] ? base64Images[index] : ''
        })
      })
    }

    console.log('listProductsSC---', listProductsSC)
    if (listProductsSC && !isEmpty(listProductsSC)) setLocalStorage(LOCAL_STORAGE.LIST_PRODUCTS, listProductsSC)
    const storageData = getLocalStorage(LOCAL_STORAGE.LIST_PRODUCTS)
    return listProductsSC || storageData || []
  } catch (error) {
    console.log('Error fetchProducts', error)
    return false
  }
})

export const getListProductsRetailer = createAsyncThunk('products/fetchProductsRetailer', async (_, { getState }) => {
  try {
    const state = getState() as RootState
    let res = await getAllRetailerProductInfo(state.user.activeWallet, state.user.activeWallet)
    if (!res.success) {
      toast.error('Fetch list product faild!')
      return false
    }
    const listProductsSC = res.data.productsInfo.map((product: ProductInfo) => {
      return {
        ...product,
        attributes:
          product.product.params.categoryID === EnumCategory.DIGITAL ||
          product.attributes.filter((attris) => attris.length > 0).length === 0
            ? [[]]
            : product.attributes
                .filter((attris) => attris.length > 0)
                .map((subAttris) => subAttris.filter((item) => item.id !== idDefault)),
        variants: product.variants.filter((vari) => vari.variantID !== idDefault)
      }
    })
    const allFileKeys = new Set<string>()
    listProductsSC.forEach((product) => {
      product.product.params.images.forEach((image) => {
        if (isBytes32(image)) {
          allFileKeys.add(image)
        }
      })
    })

    const fileKeysArray = Array.from(allFileKeys)
    if (fileKeysArray.length > 0) {
      const base64Images = await handleGetFile(state.user.activeWallet, fileKeysArray)
      console.log('base64Images list', base64Images)
      listProductsSC.forEach((product) => {
        product.product.params.fileKey = product.product.params.images.map((image) => {
          const index = fileKeysArray.indexOf(image)
          return fileKeysArray[index]
        })
        product.product.params.images = product.product.params.images.map((image) => {
          const index = fileKeysArray.indexOf(image)
          return isBytes32(image) && base64Images[index] ? base64Images[index] : ''
        })
      })
    }

    console.log('listProductsSC---', listProductsSC)
    if (listProductsSC && !isEmpty(listProductsSC)) setLocalStorage(LOCAL_STORAGE.LIST_PRODUCTS, listProductsSC)
    const storageData = getLocalStorage(LOCAL_STORAGE.LIST_PRODUCTS)
    return listProductsSC || storageData || []
  } catch (error) {
    console.log('Error fetchProductsRetailer', error)
    return false
  }
})

export const fetchBestSellter = createAsyncThunk('products/fetchBestSellter', async () => {
  try {
    let res = await getBestSeller()
    if (!res.success) return false
    if (res.data && !isEmpty(res.data)) setLocalStorage(LOCAL_STORAGE.LIST_BEST_SELLER, res.data)
    const storageData = getLocalStorage(LOCAL_STORAGE.LIST_BEST_SELLER)
    return res.data || storageData || []
  } catch (error) {
    console.log('Error fetchBestSellter', error)
    return false
  }
})

export const fetchListProductViewCount = createAsyncThunk(
  'products/fetchListProductViewCount',
  async (_, { getState }) => {
    try {
      const state = getState() as RootState
      let res = await getTotalProductViewCount(state.user.activeWallet)
      if (!res.success) return false
      console.log('listProductViewCount', res.data)
      if (res.data && !isEmpty(res.data)) setLocalStorage(LOCAL_STORAGE.LIST_PRODUCT_VIEW_COUNT, res.data)
      const storageData = getLocalStorage(LOCAL_STORAGE.LIST_PRODUCT_VIEW_COUNT)
      return res.data || storageData || { _productIds: [], _productCount: [] }
    } catch (error) {
      console.log('Error fetchListProductViewCount', error)
      return false
    }
  }
)
