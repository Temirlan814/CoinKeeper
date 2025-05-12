"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addTransaction, updateTransaction, type Transaction } from "../../store/slices/transactionSlice"
import type { RootState, AppDispatch } from "../../store"
import Input from "../UI/Input/Input"
import Select from "../UI/Select/Select"
import styles from "./TransactionForm.module.css"

interface TransactionFormProps {
  transaction?: Transaction
  onClose: () => void
}

const TransactionForm: React.FC<TransactionFormProps> = ({ transaction, onClose }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { categories } = useSelector((state: RootState) => state.categories)
  const { user } = useSelector((state: RootState) => state.auth)
  const { selectedCurrency, currencyRates } = useSelector((state: RootState) => state.currency)

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
  useEffect(() => {
    if (transaction && selectedCurrency) {
      const convertedAmount = transaction.amount * ( (currencyRates[selectedCurrency] || 1))
      setFormData((prev) => ({
        ...prev,
        amount: convertedAmount.toFixed(2),
      }))
    }
  }, [transaction, selectedCurrency, currencyRates])
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
    const baseAmount = Number.parseFloat(formData.amount) * (1 / (currencyRates[selectedCurrency]) || 1)

    const transactionData = {
      ...transaction,
      type: formData.type as "income" | "expense",
      amount: baseAmount,
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

        <Input
            label="Сумма"
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Введите сумму"
            error={errors.amount}
            fullWidth
        />

        <Select
            label="Категория"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            options={filteredCategories.map((cat) => ({
              value: cat.id.toString(),
              label: cat.name,
            }))}
            error={errors.categoryId}
            fullWidth
        />

        <Input label="Дата" type="date" name="date" value={formData.date} onChange={handleChange} fullWidth />

        <Input
            label="Комментарий (необязательно)"
            type="text"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Добавьте комментарий"
            fullWidth
        />

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
