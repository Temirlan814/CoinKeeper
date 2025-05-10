"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchCategories, deleteCategory, type Category } from "../../store/slices/categorySlice"
import type { RootState, AppDispatch } from "../../store"
import Card from "../../components/UI/Card/Card"
import CategoryList from "../../components/CategoryList/CategoryList"
import CategoryForm from "../../components/CategoryForm/CategoryForm"
import Modal from "../../components/Modal/Modal"
import styles from "./SettingsPage.module.css"

const SettingsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { categories, loading } = useSelector((state: RootState) => state.categories)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [activeTab, setActiveTab] = useState<"income" | "expense">("expense")

  useEffect(() => {
    if (user) {
      dispatch(fetchCategories(user.id))
    }
  }, [dispatch, user])

  const handleAddCategory = () => {
    setSelectedCategory(null)
    setIsModalOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category)
    setIsModalOpen(true)
  }

  const handleDeleteCategory = (id: number) => {
    if (window.confirm("Вы уверены, что хотите удалить эту категорию?")) {
      dispatch(deleteCategory(id))
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedCategory(null)
  }

  const filteredCategories = categories.filter((category) => category.type === activeTab)

  return (
    <div className={styles.settingsPage}>
      <h1 className={styles.title}>Настройки</h1>

      <Card className={styles.categoriesCard}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Категории</h2>
          <button onClick={handleAddCategory} className={styles.settingButton}>
            Добавить категорию
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === "expense" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("expense")}
          >
            Категории расходов
          </button>
          <button
            className={`${styles.tab} ${activeTab === "income" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("income")}
          >
            Категории доходов
          </button>
        </div>

        {loading ? (
          <p className={styles.loading}>Загрузка категорий...</p>
        ) : (
          <CategoryList categories={filteredCategories} onEdit={handleEditCategory} onDelete={handleDeleteCategory} />
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <CategoryForm category={selectedCategory || undefined} onClose={closeModal} />
      </Modal>
    </div>
  )
}

export default SettingsPage
