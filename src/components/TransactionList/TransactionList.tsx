"use client"

import type React from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import type { Transaction } from "../../store/slices/transactionSlice"
import type { Category } from "../../store/slices/categorySlice"
import { availableIcons } from "../Icon/IconSelector.tsx"
import styles from "./TransactionList.module.css"

interface TransactionListProps {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (id: number) => void
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onEdit, onDelete }) => {
  const { categories } = useSelector((state: RootState) => state.categories)

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find((cat: Category) => cat.id === categoryId)
    return category ? category.name : "Неизвестно"
  }

  const getCategoryColor = (categoryId: number): string => {
    const category = categories.find((cat: Category) => cat.id === categoryId)
    return category ? category.color || "#4a6fa5" : "#4a6fa5"
  }

  const getCategoryIcon = (categoryId: number): string => {
    const category = categories.find((cat: Category) => cat.id === categoryId)
    const iconId = category?.icon || "other"
    const icon = availableIcons.find((icon) => icon.id === iconId)
    return icon ? icon.emoji : "📌"
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ru-RU")
  }

  // const formatAmount = (amount: number): string => {
  //   return new Intl.NumberFormat("ru-RU", {
  //     style: "currency",
  //     currency: "RUB",
  //   }).format(amount)
  // }

  if (transactions.length === 0) {
    return <p className={styles.emptyMessage}>Транзакции не найдены.</p>
  }

  const { selectedCurrency, currencyRates } = useSelector((state: RootState) => state.currency);

  const convertCurrency = (amount: number, currency: string): number => {
    return amount * (currencyRates[currency] || 1);
  };

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: selectedCurrency,
    }).format(convertCurrency(amount, selectedCurrency));
  };
  return (
      <div className={styles.transactionList}>
        {transactions.map((transaction) => (
            <div
                key={transaction.id}
                className={styles.transactionItem}
                style={{ borderLeftColor: getCategoryColor(transaction.categoryId) }}
            >
              <div className={styles.categoryIcon}>{getCategoryIcon(transaction.categoryId)}</div>
              <div className={styles.transactionInfo}>
                <div className={styles.category}>{getCategoryName(transaction.categoryId)}</div>
                <div className={styles.date}>{formatDate(transaction.date)}</div>
                {transaction.comment && <div className={styles.comment}>{transaction.comment}</div>}
              </div>
              <div className={styles.transactionAmount}>
            <span className={transaction.type === "income" ? styles.income : styles.expense}>
              {transaction.type === "income" ? "+" : "-"} {formatAmount(transaction.amount)}
            </span>
              </div>
              <div className={styles.actions}>
                <button
                    className={styles.editButton}
                    onClick={() => onEdit(transaction)}
                    aria-label="Редактировать транзакцию"
                >
                  Ред.
                </button>
                <button
                    className={styles.deleteButton}
                    onClick={() => onDelete(transaction.id)}
                    aria-label="Удалить транзакцию"
                >
                  Удалить
                </button>
              </div>
            </div>
        ))}
      </div>
  )
}

export default TransactionList
