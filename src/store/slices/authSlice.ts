import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { api } from "../../api"
import { createDefaultCategories } from "../../utils/defaultCategories"

interface User {
  id: number
  email: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterCredentials extends LoginCredentials {
  confirmPassword: string
}

const storedUser = localStorage.getItem("user")

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: !!storedUser,
  loading: false,
  error: null,
}

export const login = createAsyncThunk("auth/login", async (credentials: LoginCredentials, { rejectWithValue }) => {
  try {
    const response = await api.get("/users", {
      params: {
        email: credentials.email,
        password: credentials.password,
      },
    })

    const user = response.data[0]

    if (!user) {
      return rejectWithValue("Неверный email или пароль")
    }

    localStorage.setItem("user", JSON.stringify(user))

    return user
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Оши��ка входа")
  }
})

export const register = createAsyncThunk(
    "auth/register",
    async (credentials: RegisterCredentials, { rejectWithValue }) => {
      try {
        const checkResponse = await api.get("/users", {
          params: {
            email: credentials.email,
          },
        })

        if (checkResponse.data.length > 0) {
          return rejectWithValue("Пользователь с таким email уже существует")
        }

        const userResponse = await api.post("/users", {
          email: credentials.email,
          password: credentials.password,
        })

        const newUser = userResponse.data

        const defaultCategories = createDefaultCategories(newUser.id)

        const categoryPromises = defaultCategories.map((category) => api.post("/categories", category))

        await Promise.all(categoryPromises)

        localStorage.setItem("user", JSON.stringify(newUser))

        return newUser
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Ошибка регистрации")
      }
    },
)

export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("user")
  return null
})

export const checkAuth = createAsyncThunk("auth/check", async (_, { rejectWithValue }) => {
  try {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      return rejectWithValue("Не авторизован")
    }
    return JSON.parse(storedUser)
  } catch (error: any) {
    localStorage.removeItem("user")
    return rejectWithValue("Ошибка проверки аутентификации")
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(login.pending, (state) => {
          state.loading = true
          state.error = null
        })
        .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
          state.loading = false
          state.user = action.payload
          state.isAuthenticated = true
        })
        .addCase(login.rejected, (state, action) => {
          state.loading = false
          state.error = action.payload as string
        })
        .addCase(register.pending, (state) => {
          state.loading = true
          state.error = null
        })
        .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
          state.loading = false
          state.user = action.payload
          state.isAuthenticated = true
        })
        .addCase(register.rejected, (state, action) => {
          state.loading = false
          state.error = action.payload as string
        })
        .addCase(logout.fulfilled, (state) => {
          state.user = null
          state.isAuthenticated = false
        })
        .addCase(checkAuth.fulfilled, (state, action: PayloadAction<User>) => {
          state.user = action.payload
          state.isAuthenticated = true
        })
        .addCase(checkAuth.rejected, (state) => {
          state.user = null
          state.isAuthenticated = false
        })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
