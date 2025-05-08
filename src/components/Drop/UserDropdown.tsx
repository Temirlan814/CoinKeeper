"use client"

import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logout } from "../../store/slices/authSlice"
import type { AppDispatch, RootState } from "../../store"
import styles from "./UserDropdown.module.css"

const UserDropdown = () => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const { user } = useSelector((state: RootState) => state.auth)

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const handleLogout = async () => {
        await dispatch(logout())
        navigate("/login")
    }

    const handleSettings = () => {
        navigate("/settings")
        setIsOpen(false)
    }

    return (
        <div className={styles.userDropdown} ref={dropdownRef}>
            <div className={styles.userInfo} onClick={toggleDropdown}>
                <span className={styles.userEmail}>{user?.email}</span>
                <div className={styles.userAvatar}>{user?.email?.charAt(0).toUpperCase() || "U"}</div>
            </div>
            {isOpen && (
                <div className={styles.dropdownMenu}>
                    <div className={styles.dropdownItem}>{user?.email}</div>
                    <div className={styles.divider}></div>
                    <div className={styles.dropdownItem} onClick={handleSettings}>
                        Настройки
                    </div>
                    <div className={styles.dropdownItem} onClick={handleLogout}>
                        Выйти
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserDropdown
