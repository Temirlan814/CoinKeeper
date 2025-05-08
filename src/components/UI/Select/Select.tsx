import type React from "react"
import type { SelectHTMLAttributes } from "react"
import styles from "./Select.module.css"

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[]
  label?: string
  error?: string
  fullWidth?: boolean
}

const Select: React.FC<SelectProps> = ({ options, label, error, fullWidth = false, className = "", ...props }) => {
  return (
    <div className={`${styles.selectContainer} ${fullWidth ? styles.fullWidth : ""} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <select className={`${styles.select} ${error ? styles.selectError : ""}`} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  )
}

export default Select
