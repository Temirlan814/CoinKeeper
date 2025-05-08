import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { api } from "../../api"

export interface Transaction {
  id: number
  type: "income" | "expense"
  amount: number
  categoryId: number
  date: string
  comment?: string
  userId: number
}

interface TransactionState {
  transactions: Transaction[]
  loading: boolean
  error: string | null
}

const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
}

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/transactions?userId=${userId}`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch transactions")
    }
  },
)

export const addTransaction = createAsyncThunk(
  "transactions/addTransaction",
  async (transaction: Omit<Transaction, "id">, { rejectWithValue }) => {
    try {
      const response = await api.post("/transactions", transaction)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to add transaction")
    }
  },
)

export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async (transaction: Transaction, { rejectWithValue }) => {
    try {
      const response = await api.put(`/transactions/${transaction.id}`, transaction)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update transaction")
    }
  },
)

export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/transactions/${id}`)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete transaction")
    }
  },
)

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    clearTransactionError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
        state.loading = false
        state.transactions = action.payload
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(addTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.transactions.push(action.payload)
      })
      .addCase(updateTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        const index = state.transactions.findIndex((t) => t.id === action.payload.id)
        if (index !== -1) {
          state.transactions[index] = action.payload
        }
      })
      .addCase(deleteTransaction.fulfilled, (state, action: PayloadAction<number>) => {
        state.transactions = state.transactions.filter((t) => t.id !== action.payload)
      })
  },
})

export const { clearTransactionError } = transactionSlice.actions
export default transactionSlice.reducer
