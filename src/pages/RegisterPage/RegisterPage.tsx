"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { register } from "../../store/slices/authSlice"
import type { AppDispatch, RootState } from "../../store"
import Input from "../../components/UI/Input/Input"
import styles from "./RegisterPage.module.css"

const RegisterPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
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
      confirmPassword: "",
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
    } else if (formData.password.length < 6) {
      errors.password = "Пароль должен содержать не менее 6 символов"
      valid = false
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Подтвердите пароль"
      valid = false
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Пароли не совпадают"
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

    const result = await dispatch(register(formData))
    if (register.fulfilled.match(result)) {
      navigate("/dashboard")
    }
  }

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerContainer}>
        <div className={`${styles.card} ${styles.registerCard}`}>
          <div className={styles.cardContent}>
            <h1 className={styles.title}>Создание аккаунта</h1>

            {error && (
                <div className={styles.error}>
                  {error === "User with this email already exists"
                      ? "Пользователь с таким email уже существует"
                      : error === "Registration failed"
                          ? "Ошибка регистрации"
                          : error}
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
                  placeholder="Введите пароль"
                  error={formErrors.password}
                  fullWidth
              />

              <Input
                  label="Подтверждение пароля"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Подтвердите пароль"
                  error={formErrors.confirmPassword}
                  fullWidth
              />

              <button
                  type="submit"
                  className={styles.registerButton}
                  disabled={loading}
              >
                {loading ? "Регистрация..." : "Зарегистрироваться"}
              </button>
            </form>

            <p className={styles.loginLink}>
              Уже есть аккаунт? <Link to="/login">Войти</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
