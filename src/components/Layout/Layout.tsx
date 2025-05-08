"use client"

import type React from "react"
import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { logout } from "../../store/slices/authSlice"
import type { AppDispatch } from "../../store"
import styles from "./Layout.module.css"

const Layout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await dispatch(logout())
    navigate("/login")
  }

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.logo}>CoinKeeper</div>
        <nav className={styles.nav}>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.active}` : styles.navLink)}
          >
            Главная
          </NavLink>
          <NavLink
            to="/stats"
            className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.active}` : styles.navLink)}
          >
            Статистика
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.active}` : styles.navLink)}
          >
            Настройки
          </NavLink>
        </nav>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Выйти
        </button>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} CoinKeeper</p>
      </footer>
    </div>
  )
}

export default Layout
