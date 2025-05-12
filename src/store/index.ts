import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import transactionReducer from "./slices/transactionSlice"
import categoryReducer from "./slices/categorySlice"
import currencyReducer from "./slices/currencySlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    currency: currencyReducer,
    transactions: transactionReducer,
    categories: categoryReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
