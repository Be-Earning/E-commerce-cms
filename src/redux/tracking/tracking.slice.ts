import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { isEmpty } from 'lodash'
import { LOCAL_STORAGE } from '~/constants/localStorage'
import { getLocalStorage, setLocalStorage } from '~/utils/localStorage'
import { RootState } from '../configStore'
import { sendTransaction } from '~/smartContract/combineSdk'
import { ISystemInfo } from '~/@types/models'

interface TrackingState {
  isLoading: boolean
  systemInfo: ISystemInfo | null
}

const initialState: TrackingState = {
  isLoading: false,
  systemInfo: getLocalStorage(LOCAL_STORAGE.SYSTEM_INFO) || null
}

const trackingSlice = createSlice({
  name: 'tracking',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSystemInfo.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchSystemInfo.fulfilled, (state, action) => {
        state.isLoading = false
        state.systemInfo = action.payload === false ? null : action.payload
      })
      .addCase(fetchSystemInfo.rejected, (state) => {
        state.isLoading = false
        state.systemInfo = null
      })
  }
})

const trackingReducer = trackingSlice.reducer

export default trackingReducer

export const fetchSystemInfo = createAsyncThunk('tracking/fetchSystemInfo', async (_, { getState }) => {
  try {
    const state = getState() as RootState
    let res = await sendTransaction('getSystemInfo', {}, 'ecom-info', state.user.activeWallet, 'chain', 'read')
    if (!res.success) return false
    console.log('systemInfo', res.data)
    if (res.data && !isEmpty(res.data)) setLocalStorage(LOCAL_STORAGE.SYSTEM_INFO, res.data)
    const storageData = getLocalStorage(LOCAL_STORAGE.SYSTEM_INFO)
    return res.data || storageData || null
  } catch (error) {
    console.log('Error fetchSystemInfo', error)
    return false
  }
})
