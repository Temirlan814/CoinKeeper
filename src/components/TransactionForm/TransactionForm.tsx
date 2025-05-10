"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addTransaction, updateTransaction, type Transaction } from "../../store/slices/transactionSlice"
import type { RootState, AppDispatch } from "../../store"
import styles from "./TransactionForm.module.css"

interface TransactionFormProps {
  transaction?: Transaction
  onClose: () => void
}

const TransactionForm: React.FC<TransactionFormProps> = ({ transaction, onClose }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { categories } = useSelector((state: RootState) => state.categories)
  const { user } = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState({
    type: transaction?.type || "expense",
    amount: transaction?.amount?.toString() || "",
    categoryId: transaction?.categoryId?.toString() || "",
    date: transaction?.date || new Date().toISOString().split("T")[0],
    comment: transaction?.comment || "",
  })

  const [errors, setErrors] = useState({
    amount: "",
    categoryId: "",
  })

  const filteredCategories = categories.filter((category) => category.type === formData.type)

  useEffect(() => {
    if (filteredCategories.length > 0 && !formData.categoryId) {
      setFormData((prev) => ({
        ...prev,
        categoryId: filteredCategories[0].id.toString(),
      }))
    }
  }, [filteredCategories, formData.categoryId, formData.type])

  const formatAmount = (value: string) => {
    return value.replace(/[^\d.]/g, "")
  }

  const validateForm = () => {
    let valid = true
    const newErrors = {
      amount: "",
      categoryId: "",
    }

    if (!formData.amount || Number.parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Введите корректную сумму"
      valid = false
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Выберите категорию"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === "amount") {
      setFormData((prev) => ({ ...prev, [name]: formatAmount(value) }))
    } else if (name === "type") {
      const selectedType = value as "income" | "expense"

      setFormData((prev) => ({
        ...prev,
        type: selectedType,
        categoryId: categories.find((c) => c.type === selectedType)?.id.toString() || "",
      }))
    }

    else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !user) return

    const transactionData = {
      ...transaction,
      type: formData.type as "income" | "expense",
      amount: Number.parseFloat(formData.amount),
      categoryId: Number.parseInt(formData.categoryId),
      date: formData.date,
      comment: formData.comment,
      userId: user.id,
    }

    if (transaction) {
      await dispatch(updateTransaction(transactionData as Transaction))
    } else {
      await dispatch(addTransaction(transactionData))
    }

    onClose()
  }

  return (
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>{transaction ? "Редактировать транзакцию" : "Добавить транзакцию"}</h2>

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
          <label htmlFor="amount" className={styles.label}>Сумма</label>
          <input
              id="amount"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Введите сумму"
              className={`${styles.input} ${errors.amount ? styles.inputError : ""}`}
          />
          {errors.amount && <p className={styles.errorText}>{errors.amount}</p>}
        </div>


        <div className={styles.inputContainer}>
          <label htmlFor="categoryId" className={styles.label}>Категория</label>
          <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className={`${styles.select} ${errors.categoryId ? styles.selectError : ""}`}
          >
            {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </option>
            ))}
          </select>
          {errors.categoryId && <p className={styles.errorText}>{errors.categoryId}</p>}
        </div>


        <div className={styles.inputContainer}>
          <label htmlFor="date" className={styles.label}>Дата</label>
          <input
              id="date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={styles.input}
          />
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="comment" className={styles.label}>Комментарий (необязательно)</label>
          <input
              id="comment"
              type="text"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              placeholder="Добавьте комментарий"
              className={styles.input}
          />
        </div>


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
            {transaction ? "Обновить" : "Добавить"}
          </button>
        </div>
      </form>
  )
}

export default TransactionForm
