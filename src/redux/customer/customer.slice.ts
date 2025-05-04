import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { isEmpty } from 'lodash'
import { ICustomerInfor } from '~/@types/models'
import { LOCAL_STORAGE } from '~/constants/localStorage'
import { getUsersInfo } from '~/contract/functionSmc'
import { getLocalStorage, setLocalStorage } from '~/utils/localStorage'
import { RootState } from '../configStore'

interface CustomerState {
  isLoading: boolean
  listCustomers: ICustomerInfor[]
  totalPurchaseInfo: any[]
}

const initialState: CustomerState = {
  isLoading: false,
  listCustomers: getLocalStorage(LOCAL_STORAGE.LIST_CUSTOMERS) || [],
  totalPurchaseInfo: []
}

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setListCustomer(state, action) {
      return {
        ...state,
        listCustomers: action.payload
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getListCustomers.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getListCustomers.fulfilled, (state, action) => {
        state.isLoading = false
        state.listCustomers =
          action.payload === false ? getLocalStorage(LOCAL_STORAGE.LIST_CUSTOMERS) || [] : action.payload
      })
      .addCase(getListCustomers.rejected, (state) => {
        state.isLoading = false
      })
  }
})

export const { setListCustomer } = customerSlice.actions
const customerReducer = customerSlice.reducer

export default customerReducer

export const getListCustomers = createAsyncThunk(
  'customer/getListCustomers',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      let res = await getUsersInfo(state.user.activeWallet)
      if (!res.success) return false
      const result = res.data.infos.map((item: ICustomerInfor, index: number) => ({
        ...item,
        id: item.user,
        purchases: res.data.purchases?.[index]
      }))
      console.log('result customer', result)
      if (result && !isEmpty(result)) setLocalStorage(LOCAL_STORAGE.LIST_CUSTOMERS, result)
      const storageData = getLocalStorage(LOCAL_STORAGE.LIST_CUSTOMERS)
      return result || storageData || []
    } catch (error) {
      console.log('Error getListCustomers', error)
      rejectWithValue(false)
      return false
    }
  }
)
