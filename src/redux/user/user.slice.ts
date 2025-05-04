import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { isEmpty } from 'lodash'
import { Role } from '~/@types/enums'
import { IUpdateInfo, WalletInfo } from '~/@types/models'
import { LOCAL_STORAGE } from '~/constants/localStorage'
import { sendTransaction } from '~/smartContract/combineSdk'
import { getLocalStorage, removeLocalStorage, setLocalStorage } from '~/utils/localStorage'
import { RootState } from '../configStore'
import toast from 'react-hot-toast'

interface IinitialState {
  isVip: boolean
  isLoading: boolean
  isDoneRole: boolean
  activeWallet: string
  hiddenWallet?: string
  userRole: Role
  userInfo: IUpdateInfo | null
  walletInfo: WalletInfo | null
}

const initialState: IinitialState = {
  isVip: true,
  isLoading: false,
  isDoneRole: false,
  activeWallet: getLocalStorage(LOCAL_STORAGE.ACTIVE_WALLET) || '',
  hiddenWallet: getLocalStorage(LOCAL_STORAGE.HIDDEN_WALLET),
  walletInfo: getLocalStorage(LOCAL_STORAGE.HIDDEN_WALLET),
  userRole: getLocalStorage(LOCAL_STORAGE.USER_ROLE),
  userInfo: getLocalStorage(LOCAL_STORAGE.USER_INFO)
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setHiddenWallet(state, action: { payload: string }) {
      state.hiddenWallet = action.payload
      setLocalStorage(LOCAL_STORAGE.HIDDEN_WALLET, state.hiddenWallet)
    },
    setActiveWallet(state, action: { payload: string }) {
      state.activeWallet = action.payload
      setLocalStorage(LOCAL_STORAGE.ACTIVE_WALLET, state.activeWallet)
    },
    clearActiveWallet(state) {
      state.activeWallet = ''
      removeLocalStorage(LOCAL_STORAGE.ACTIVE_WALLET)
    },
    setWalletInfo(state, action: { payload: WalletInfo }) {
      state.walletInfo = action.payload
    },
    updateProfile: (state, action) => {
      state.userInfo = action.payload
      setLocalStorage(LOCAL_STORAGE.USER_INFO, state.userInfo)
    },
    deleteProfile: (state) => {
      state.userInfo = null
      removeLocalStorage(LOCAL_STORAGE.USER_INFO)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserRole.pending, (state) => {
        state.isLoading = true
        state.isDoneRole = false
      })
      .addCase(fetchUserRole.fulfilled, (state, action) => {
        state.isLoading = false
        state.isDoneRole = true
        state.userRole =
          (action.payload === false ? Role.ADMIN : +action.payload === 0 ? Role.ADMIN : Role.RETAILER) ||
          getLocalStorage(LOCAL_STORAGE.USER_ROLE)
      })
      .addCase(fetchUserRole.rejected, (state) => {
        console.log('fetch role fasle')
        state.isLoading = false
        state.isDoneRole = true
        state.userRole = getLocalStorage(LOCAL_STORAGE.USER_ROLE)
      })
      .addCase(fetchUserRole2.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchUserRole2.fulfilled, (state, action) => {
        state.isLoading = false
        state.userRole =
          (action.payload === false ? Role.ADMIN : +action.payload === 0 ? Role.ADMIN : Role.RETAILER) ||
          getLocalStorage(LOCAL_STORAGE.USER_ROLE)
      })
      .addCase(fetchUserRole2.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(fetchUserInfo.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.isLoading = false
        state.userInfo = action.payload === false ? null : action.payload
      })
      .addCase(fetchUserInfo.rejected, (state) => {
        state.isLoading = false
      })
  }
})

export const { setHiddenWallet, setActiveWallet, clearActiveWallet, setWalletInfo, updateProfile, deleteProfile } =
  userSlice.actions

const userReducer = userSlice.reducer

export default userReducer

export const fetchUserRole = createAsyncThunk('user/fetchUserRole', async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState() as RootState
    let res = await sendTransaction(
      'getUserRole',
      { _user: `0x${state.user.activeWallet}` },
      'ecom-user',
      state.user.activeWallet,
      'chain',
      'read'
    )
    if (!res.success) return false
    if (res.data && !isEmpty(res.data)) setLocalStorage(LOCAL_STORAGE.USER_ROLE, 0)
    const storageData = getLocalStorage(LOCAL_STORAGE.USER_ROLE)
    return storageData
    // return res.data || storageData || null
  } catch (error) {
    console.log('Error fetchUserRole', error)
    rejectWithValue(error)
    return false
  }
})

export const fetchUserRole2 = createAsyncThunk('user/fetchUserRole2', async (address: string) => {
  try {
    let res = await sendTransaction('getUserRole', { _user: `0x${address}` }, 'ecom-user', address, 'chain', 'read')
    if (!res.success) {
      if (res.message) toast.error(res.message)
      return false
    }
    if (res.data && !isEmpty(res.data)) setLocalStorage(LOCAL_STORAGE.USER_ROLE, res.data)
    return res.data || null
    // if (res.data && !isEmpty(res.data)) setLocalStorage(LOCAL_STORAGE.USER_ROLE, 0)
    // return '0'
  } catch (error) {
    console.log('Error fetchUserRole', error)
    return false
  }
})

export const fetchUserInfo = createAsyncThunk('user/fetchUserInfo', async (_, { getState }) => {
  try {
    const state = getState() as RootState
    let res = await sendTransaction(
      'getUserInfo',
      { _user: state.user.activeWallet },
      'ecom-user',
      state.user.activeWallet,
      'chain',
      'read'
    )
    if (!res.success) return false
    console.log('userInfo res', res.data)
    if (res.data && !isEmpty(res.data)) setLocalStorage(LOCAL_STORAGE.USER_INFO, res.data)
    const storageData = getLocalStorage(LOCAL_STORAGE.USER_INFO)
    return res.data || storageData || null
  } catch (error) {
    console.log('Error fetchUserInfo', error)
    return false
  }
})
