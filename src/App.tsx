"use client"

import type React from "react"
import { useEffect } from "react"
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import LoginPage from "@/pages/Login/LoginPage"
import RegisterPage from "@/pages/Register/RegisterPage"
import DashboardPage from "@/pages/Dashboard/DashboardPage"
import StatsPage from "@/pages/Stats/StatsPage"
import SettingsPage from "@/pages/Settings/SettingsPage"
import Layout from "./components/Layout/Layout"
import type { RootState } from "./store"
import { checkAuth } from "./store/slices/authSlice"
import type { AppDispatch } from "./store"

const App: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<Layout />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stats"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <StatsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

interface ProtectedRouteProps {
  isAuthenticated: boolean
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated, children }) => {
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
    }
  }, [isAuthenticated, navigate])

  return <>{isAuthenticated ? children : null}</>
}

export default App
