import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { api } from "../../api"

export interface Category {
  id: number
  name: string
  icon?: string
  color?: string
  userId: number
  type: "income" | "expense"
}

interface CategoryState {
  categories: Category[]
  loading: boolean
  error: string | null
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
}

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/categories?userId=${userId}`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch categories")
    }
  },
)

export const addCategory = createAsyncThunk(
  "categories/addCategory",
  async (category: Omit<Category, "id">, { rejectWithValue }) => {
    try {
      const response = await api.post("/categories", category)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to add category")
    }
  },
)

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async (category: Category, { rejectWithValue }) => {
    try {
      const response = await api.put(`/categories/${category.id}`, category)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update category")
    }
  },
)

export const deleteCategory = createAsyncThunk("categories/deleteCategory", async (id: number, { rejectWithValue }) => {
  try {
    await api.delete(`/categories/${id}`)
    return id
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete category")
  }
})

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.loading = false
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(addCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.categories.push(action.payload)
      })
      .addCase(updateCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        const index = state.categories.findIndex((c) => c.id === action.payload.id)
        if (index !== -1) {
          state.categories[index] = action.payload
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<number>) => {
        state.categories = state.categories.filter((c) => c.id !== action.payload)
      })
  },
})

export const { clearCategoryError } = categorySlice.actions
export default categorySlice.reducer
