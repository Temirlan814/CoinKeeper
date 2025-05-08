import type React from "react"
import type { InputHTMLAttributes } from "react"
import styles from "./Input.module.css"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  fullWidth?: boolean
}

const Input: React.FC<InputProps> = ({ label, error, fullWidth = false, className = "", ...props }) => {
  return (
    <div className={`${styles.inputContainer} ${fullWidth ? styles.fullWidth : ""} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <input className={`${styles.input} ${error ? styles.inputError : ""}`} {...props} />
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  )
}

export default Input
