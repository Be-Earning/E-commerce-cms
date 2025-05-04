import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { isEmpty } from 'lodash'
import { LOCAL_STORAGE } from '~/constants/localStorage'
import { getBrands } from '~/contract/functionSmc'
import { convertBytesToString, isByteString } from '~/utils/convert'
import { getLocalStorage, setLocalStorage } from '~/utils/localStorage'

interface CatgoryState {
  isLoading: boolean
  listBrands: string[]
}

const initialState: CatgoryState = {
  isLoading: false,
  listBrands: getLocalStorage(LOCAL_STORAGE.LIST_BRANDS) || []
}

const brandSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {
    setListBrand(state, action) {
      return {
        ...state,
        listCategories: action.payload
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getListBrands.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getListBrands.fulfilled, (state, action) => {
        state.isLoading = false
        state.listBrands = action.payload === false ? getLocalStorage(LOCAL_STORAGE.LIST_BRANDS) || [] : action.payload
      })
      .addCase(getListBrands.rejected, (state) => {
        state.isLoading = false
      })
  }
})

export const { setListBrand } = brandSlice.actions
const brandReducer = brandSlice.reducer

export default brandReducer

export const getListBrands = createAsyncThunk('brand/getListBrands', async () => {
  try {
    let res = await getBrands()
    if (!res.success) return false
    const resConvert = res.data
      .map((brand: string) => {
        if (isByteString(brand)) {
          return convertBytesToString(brand)
        } else {
          return brand
        }
      })
      .filter((b) => b !== '')
    console.log('getBrands', resConvert)
    if (res.data && !isEmpty(res.data)) setLocalStorage(LOCAL_STORAGE.LIST_BRANDS, resConvert)
    const storageData = getLocalStorage(LOCAL_STORAGE.LIST_BRANDS)
    return resConvert || storageData || []
  } catch (error) {
    console.log('Error getBrands', error)
    return false
  }
})
