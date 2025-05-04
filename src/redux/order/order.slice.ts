import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { isEmpty } from 'lodash'
import { IOrder } from '~/@types/models/order'
import { LOCAL_STORAGE } from '~/constants/localStorage'
import { getOrders } from '~/contract/functionSmc'
import { getLocalStorage, setLocalStorage } from '~/utils/localStorage'
import { RootState } from '../configStore'

interface OrderState {
  isLoading: boolean
  listOrders: IOrder[]
}

const initialState: OrderState = {
  isLoading: false,
  listOrders: getLocalStorage(LOCAL_STORAGE.LIST_ORDERS) || []
}

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setListOrder(state, action) {
      return {
        ...state,
        listOrders: action.payload
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getListOrders.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getListOrders.fulfilled, (state, action) => {
        state.isLoading = false
        state.listOrders = action.payload === false ? getLocalStorage(LOCAL_STORAGE.LIST_ORDERS) || [] : action.payload
      })
      .addCase(getListOrders.rejected, (state) => {
        state.isLoading = false
      })
  }
})

export const { setListOrder } = orderSlice.actions
const orderReducer = orderSlice.reducer

export default orderReducer

export const getListOrders = createAsyncThunk('purchase/getListOrders', async (_, { getState }) => {
  try {
    const state = getState() as RootState
    let res = await getOrders(state.user.activeWallet)
    if (!res.success) return false
    console.log('listOrders', res.data?.res)
    if (res.data?.res && !isEmpty(res.data?.res)) setLocalStorage(LOCAL_STORAGE.LIST_ORDERS, res.data?.res)
    const storageData = getLocalStorage(LOCAL_STORAGE.LIST_ORDERS)
    return res.data?.res || storageData || []
  } catch (error) {
    console.log('Error getListOrders', error)
    return false
  }
})
