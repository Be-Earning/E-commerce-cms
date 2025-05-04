import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import brandReducer from './brand/brand.slice'
import categoryReducer from './category/category.slice'
import customerReducer from './customer/customer.slice'
import orderReducer from './order/order.slice'
import productReducer from './product/product.slice'
import purchaseReducer from './purchase/purchase.slice'
import rootReducer from './root/root.slice'
import userReducer from './user/user.slice'
import trackingReducer from './tracking/tracking.slice'

export const store = configureStore({
  reducer: {
    brand: brandReducer,
    customer: customerReducer,
    category: categoryReducer,
    product: productReducer,
    purchase: purchaseReducer,
    order: orderReducer,
    user: userReducer,
    root: rootReducer,
    tracking: trackingReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat()
})

export type RootState = ReturnType<typeof store.getState>

export const useAppDispatch: () => typeof store.dispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
