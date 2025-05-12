import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { api } from "@/api"
import type { RootState } from "@/store"

interface CurrencyState {
    selectedCurrency: string
    currencyRates: Record<string, number>
    loading: boolean
    error: string | null
}

const getUserCurrency = (): string => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
        try {
            const user = JSON.parse(storedUser)
            return user.currency || "KZT"
        } catch (e) {
            return "KZT"
        }
    }
    return "KZT"
}

const initialState: CurrencyState = {
    selectedCurrency: getUserCurrency(),
    currencyRates: {
        KZT: 1,
        RUB: 0.2,
        CNY: 0.014,
        JPY: 0.29,
    },
    loading: false,
    error: null,
}

export const updateUserCurrency = createAsyncThunk(
    "currency/updateUserCurrency",
    async (currency: string, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState
            const userId = state.auth.user?.id

            if (!userId) {
                return rejectWithValue("User not authenticated")
            }

            const userResponse = await api.get(`/users/${userId}`)
            const userData = userResponse.data

            const response = await api.patch(`/users/${userId}`, {
                ...userData,
                currency,
            })

            const storedUser = localStorage.getItem("user")
            if (storedUser) {
                const user = JSON.parse(storedUser)
                user.currency = currency
                localStorage.setItem("user", JSON.stringify(user))
            }

            return currency
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update currency")
        }
    },
)

const currencySlice = createSlice({
    name: "currency",
    initialState,
    reducers: {
        setCurrency: (state, action: PayloadAction<string>) => {
            state.selectedCurrency = action.payload
        },
        setCurrencyRates: (state, action: PayloadAction<Record<string, number>>) => {
            state.currencyRates = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateUserCurrency.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateUserCurrency.fulfilled, (state, action) => {
                state.loading = false
                state.selectedCurrency = action.payload
            })
            .addCase(updateUserCurrency.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export const { setCurrency, setCurrencyRates } = currencySlice.actions
export default currencySlice.reducer
