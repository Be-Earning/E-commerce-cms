import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { isEmpty } from 'lodash'
import { LOCAL_STORAGE } from '~/constants/localStorage'
import { getLocalStorage, setLocalStorage } from '~/utils/localStorage'
import { RootState } from '../configStore'
import { sendTransaction } from '~/smartContract/combineSdk'

interface PurchaseState {
  isLoading: boolean
  listPurchases: any[]
}

const initialState: PurchaseState = {
  isLoading: false,
  listPurchases: getLocalStorage(LOCAL_STORAGE.LIST_PURCHASES) || []
}

const purchaseSlice = createSlice({
  name: 'purchase',
  initialState,
  reducers: {
    setListpurchase(state, action) {
      return {
        ...state,
        listpurchases: action.payload
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getListPurchasesCustomer.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getListPurchasesCustomer.fulfilled, (state, action) => {
        state.isLoading = false
        state.listPurchases = action.payload === false ? [] : action.payload
      })
      .addCase(getListPurchasesCustomer.rejected, (state) => {
        state.isLoading = false
        state.listPurchases = []
      })
  }
})

export const { setListpurchase } = purchaseSlice.actions
const purchaseReducer = purchaseSlice.reducer

export default purchaseReducer

export const getListPurchasesCustomer = createAsyncThunk(
  'purchase/getListPurchasesCustomer',
  async (customerAddress: string, { getState }) => {
    try {
      const state = getState() as RootState
      let res = await sendTransaction(
        'getUserPurchaseInfo',
        { _user: customerAddress },
        'ecom-info',
        state.user.activeWallet,
        'chain',
        'read'
      )
      if (!res.success) return false
      console.log('listpurchases', res.data)
      if (res.data && !isEmpty(res.data)) setLocalStorage(LOCAL_STORAGE.LIST_PURCHASES, res.data)
      const storageData = getLocalStorage(LOCAL_STORAGE.LIST_PURCHASES)
      return res.data || storageData || []
    } catch (error) {
      console.log('Error getListPurchasesCustomer', error)
      return false
    }
  }
)

export const getListPurchasesAgent = createAsyncThunk(
  'purchase/getListPurchasesAgent',
  async (retailerAddress, { getState }) => {
    try {
      const state = getState() as RootState
      let res = await sendTransaction(
        'getAllRetailerProductInfo',
        { _retailer: retailerAddress },
        'ecom-product',
        state.user.activeWallet,
        'chain',
        'read'
      )
      if (!res.success) return false
      console.log('listpurchases', res.data)
      if (res.data && !isEmpty(res.data)) setLocalStorage(LOCAL_STORAGE.LIST_PURCHASES, res.data)
      const storageData = getLocalStorage(LOCAL_STORAGE.LIST_PURCHASES)
      return res.data || storageData || []
    } catch (error) {
      console.log('Error getListPurchasesAgent', error)
      return false
    }
  }
)
