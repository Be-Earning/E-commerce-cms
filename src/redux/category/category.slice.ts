import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { isEmpty } from 'lodash'
import { ICategory } from '~/@types/models'
import { LOCAL_STORAGE } from '~/constants/localStorage'
import { getCategories } from '~/contract/functionSmc'
import { getLocalStorage, setLocalStorage } from '~/utils/localStorage'

interface CatgoryState {
  isLoading: boolean
  listCategories: ICategory[]
}

const initialState: CatgoryState = {
  isLoading: false,
  listCategories: getLocalStorage(LOCAL_STORAGE.LIST_CATEGORIES) || []
}

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListCategories.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getListCategories.fulfilled, (state, action) => {
        state.isLoading = false
        state.listCategories =
          action.payload === false ? getLocalStorage(LOCAL_STORAGE.LIST_CATEGORIES) || [] : action.payload
      })
      .addCase(getListCategories.rejected, (state) => {
        state.isLoading = false
      })
  }
})

const categoryReducer = categorySlice.reducer

export default categoryReducer

export const getListCategories = createAsyncThunk('category/getListCategories', async () => {
  try {
    let res = await getCategories()
    if (!res.success) return false
    console.log('listCategories', res.data)
    if (res.data && !isEmpty(res.data)) setLocalStorage(LOCAL_STORAGE.LIST_CATEGORIES, res.data)
    const storageData = getLocalStorage(LOCAL_STORAGE.LIST_CATEGORIES)
    return res.data || storageData || []
  } catch (error) {
    console.log('Error getListCategories', error)
    return false
  }
})
