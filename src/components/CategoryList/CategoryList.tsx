"use client"

import type React from "react"
import type { Category } from "@/store/slices/categorySlice.ts"
import styles from "./CategoryList.module.css"

interface CategoryListProps {
  categories: Category[]
  onEdit: (category: Category) => void
  onDelete: (id: number) => void
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, onEdit, onDelete }) => {
  if (categories.length === 0) {
    return <p className={styles.emptyMessage}>Категории не найдены.</p>
  }

  const getTypeLabel = (type: string): string => {
    return type === "income" ? "Доход" : "Расход"
  }

  return (
    <div className={styles.categoryList}>
      {categories.map((category) => (
        <div key={category.id} className={styles.categoryItem} style={{ borderLeftColor: category.color || "#4a6fa5" }}>
          <div className={styles.categoryInfo}>
            <div className={styles.categoryName}>{category.name}</div>
            <div className={styles.categoryType}>{getTypeLabel(category.type)}</div>
          </div>
          <div className={styles.actions}>
            <button className={styles.editButton} onClick={() => onEdit(category)} aria-label="Редактировать категорию">
              Ред.
            </button>
            <button
              className={styles.deleteButton}
              onClick={() => onDelete(category.id)}
              aria-label="Удалить категорию"
            >
              Удалить
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CategoryList
