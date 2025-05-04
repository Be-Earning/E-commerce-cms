import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { Role } from '~/@types/enums'
import { getLocalStorage, setLocalStorage } from '~/utils/localStorage'
import { getListBrands } from '../brand/brand.slice'
import { getListCategories } from '../category/category.slice'
import { RootState } from '../configStore'
import { getListCustomers } from '../customer/customer.slice'
import { getListOrders } from '../order/order.slice'
import {
  fetchBestSellter,
  fetchListProductViewCount,
  getListProducts,
  getListProductsRetailer
} from '../product/product.slice'
import { fetchSystemInfo } from '../tracking/tracking.slice'
import { fetchUserInfo } from '../user/user.slice'

interface rootState {
  isFinish: boolean
}

const initialState: rootState = {
  isFinish: false
}

const rootSlice = createSlice({
  name: 'root',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRootPublic.pending, (state) => {
        state.isFinish = false
      })
      .addCase(fetchRootPublic.fulfilled, (state, action) => {
        state.isFinish = action.payload
      })
      .addCase(fetchRootPublic.rejected, (state) => {
        state.isFinish = false
      })
      .addCase(fetchRootPrivate.pending, (state) => {
        state.isFinish = false
      })
      .addCase(fetchRootPrivate.fulfilled, (state, action) => {
        state.isFinish = action.payload
      })
      .addCase(fetchRootPrivate.rejected, (state) => {
        state.isFinish = false
      })
  }
})

const rootReducer = rootSlice.reducer

export default rootReducer

export const fetchRootPrivate = createAsyncThunk('root/fetchRootPrivate', async (_, { dispatch, getState }) => {
  try {
    const globalState = getState() as RootState
    if (globalState.user.activeWallet) {
      if (+globalState.user.userRole === Role.RETAILER) {
        const [resUserInfo, resProductsRetailer, resProductsViewCount] = await Promise.all([
          dispatch(fetchUserInfo()),
          dispatch(getListProductsRetailer()),
          dispatch(fetchListProductViewCount())
        ])
        if (!resUserInfo.payload) {
          toast.error('Fetch user info faile!')
        }
        if (!resProductsRetailer.payload) {
          toast.error('Fetch list products retailer faile!')
        }
        if (!resProductsViewCount.payload) {
          toast.error('Fetch list products view count faile!')
        }
      } else {
        const [resProducts, resSystemInfo] = await Promise.all([
          dispatch(getListProducts()),
          dispatch(fetchSystemInfo()),
          dispatch(fetchListProductViewCount())
        ])
        console.log('resProducts', resProducts)
        if (!resProducts.payload) {
          toast.error('Fetch list products faile!')
        }
        if (!resSystemInfo.payload) {
          toast.error('Fetch system infor faile!')
        }
      }
      const [resOrders, resCutomer] = await Promise.all([dispatch(getListOrders()), dispatch(getListCustomers())])
      if (!resOrders.payload) {
        toast.error('Fetch list order faile!')
        return false
      }
      if (!resCutomer.payload) {
        toast.error('Fetch list customers faile!')
        return false
      }
      setLocalStorage('fetch-root-private', new Date().getTime())
    }
    return true
  } catch (error) {
    console.log('Error fetch root private: ', error)
    return false
  }
})

export const fetchRootPublic = createAsyncThunk('root/fetchRootPublic', async (_, { dispatch }) => {
  try {
    const timeout = 0
    const currentTime = Date.now()
    const timestampToCheck = getLocalStorage('fetch-root-public')

    const isTimePassed = currentTime - (timestampToCheck === null ? 0 : timestampToCheck) >= timeout

    if (isTimePassed) {
      const [resCategories, resBrands, resBestSellter] = await Promise.all([
        dispatch(getListCategories()),
        dispatch(getListBrands()),
        dispatch(fetchBestSellter())
      ])

      if (!resCategories.payload) {
        toast.error('Fetch list categories failed!')
        return false
      }

      if (!resBrands.payload) {
        toast.error('Fetch list brands failed!')
        return false
      }

      if (!resBestSellter.payload) {
        toast.error('Fetch best seller failed!')
        return false
      }

      setLocalStorage('fetch-root-public', new Date().getTime())
    }

    return true
  } catch (error) {
    console.log('Error fetch root public: ', error)
    return false
  }
})
