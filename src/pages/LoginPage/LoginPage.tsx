"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { login } from "../../store/slices/authSlice"
import type { AppDispatch, RootState } from "../../store"
import Input from "../../components/UI/Input/Input"
import styles from "./LoginPage.module.css"

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard")
    }
  }, [isAuthenticated, navigate])

  const validateForm = () => {
    let valid = true
    const errors = {
      email: "",
      password: "",
    }

    if (!formData.email) {
      errors.email = "Введите email"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Некорректный email"
      valid = false
    }

    if (!formData.password) {
      errors.password = "Введите пароль"
      valid = false
    }

    setFormErrors(errors)
    return valid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const result = await dispatch(login(formData))
    if (login.fulfilled.match(result)) {
      navigate("/dashboard")
    }
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={`${styles.card} ${styles.loginCard}`}>
          <div className={styles.cardContent}>
            <h1 className={styles.title}>Вход в CoinKeeper</h1>

            {error && (
                <div className={styles.error}>
                  {error === "Invalid email or password" ? "Неверный email или пароль" : error}
                </div>
            )}

            <form className={styles.form} onSubmit={handleSubmit}>
              <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Введите ваш email"
                  error={formErrors.email}
                  fullWidth
              />

              <Input
                  label="Пароль"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Введите ваш пароль"
                  error={formErrors.password}
                  fullWidth
              />

              <button
                  type="submit"
                  className={styles.loginButton}
                  disabled={loading}
              >
                {loading ? "Вход..." : "Войти"}
              </button>
            </form>

            <p className={styles.registerLink}>
              Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
