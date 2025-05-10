"use client"

import type React from "react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addCategory, updateCategory, type Category } from "../../store/slices/categorySlice"
import type { RootState, AppDispatch } from "../../store"
import IconSelector from "../Icon/IconSelector"
import styles from "./CategoryForm.module.css"

interface CategoryFormProps {
  category?: Category
  onClose: () => void
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onClose }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState({
    name: category?.name || "",
    type: category?.type || "expense",
    color: category?.color || "#4a6fa5",
    icon: category?.icon || "other",
  })

  const [errors, setErrors] = useState({
    name: "",
  })

  const validateForm = () => {
    let valid = true
    const newErrors = {
      name: "",
    }

    if (!formData.name.trim()) {
      newErrors.name = "Введите название категории"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleIconSelect = (iconId: string) => {
    setFormData((prev) => ({ ...prev, icon: iconId }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !user) return

    const categoryData = {
      ...category,
      name: formData.name,
      type: formData.type as "income" | "expense",
      color: formData.color,
      icon: formData.icon,
      userId: user.id,
    }

    if (category) {
      await dispatch(updateCategory(categoryData as Category))
    } else {
      await dispatch(addCategory(categoryData))
    }

    onClose()
  }

  return (
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>{category ? "Редактировать категорию" : "Добавить категорию"}</h2>

        <div className={styles.inputContainer}>
          <label htmlFor="name" className={styles.label}>Название категории</label>
          <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Введите название категории"
              className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
          />
          {errors.name && <p className={styles.errorText}>{errors.name}</p>}
        </div>


        <div className={styles.typeSelector}>
          <label className={styles.radioLabel}>
            <input
                type="radio"
                name="type"
                value="expense"
                checked={formData.type === "expense"}
                onChange={handleChange}
            />
            <span>Расход</span>
          </label>
          <label className={styles.radioLabel}>
            <input type="radio" name="type" value="income" checked={formData.type === "income"} onChange={handleChange} />
            <span>Доход</span>
          </label>
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="color" className={styles.label}>Цвет</label>
          <input
              type="color"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className={styles.input}
          />
        </div>

        <label className={styles.label}>Иконка</label>
        <IconSelector selectedIcon={formData.icon} onSelectIcon={handleIconSelect} />

        <div className={styles.actions}>
          <button
              type="button"
              onClick={onClose}
              className={`${styles.actionButton} ${styles.secondary}`}
          >
            Отмена
          </button>
          <button
              type="submit"
              className={`${styles.actionButton} ${styles.primary}`}
          >
            {category ? "Обновить" : "Добавить"}
          </button>
        </div>

      </form>
  )
}

export default CategoryForm
