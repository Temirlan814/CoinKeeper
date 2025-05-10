"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchTransactions, deleteTransaction, type Transaction } from "../../store/slices/transactionSlice"
import { fetchCategories } from "../../store/slices/categorySlice"
import type { RootState, AppDispatch } from "../../store"
import TransactionList from "../../components/TransactionList/TransactionList"
import TransactionForm from "../../components/TransactionForm/TransactionForm"
import Modal from "../../components/Modal/Modal"
import styles from "./DashboardPage.module.css"

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { transactions, loading } = useSelector((state: RootState) => state.transactions)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [balance, setBalance] = useState(0)
  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)

  useEffect(() => {
    if (user) {
      dispatch(fetchTransactions(user.id))
      dispatch(fetchCategories(user.id))
    }
  }, [dispatch, user])

  useEffect(() => {
    let totalIncome = 0
    let totalExpense = 0

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        totalIncome += transaction.amount
      } else {
        totalExpense += transaction.amount
      }
    })

    setIncome(totalIncome)
    setExpense(totalExpense)
    setBalance(totalIncome - totalExpense)
  }, [transactions])

  const handleAddTransaction = () => {
    setSelectedTransaction(null)
    setIsModalOpen(true)
  }

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsModalOpen(true)
  }

  const handleDeleteTransaction = (id: number) => {
    if (window.confirm("Вы уверены, что хотите удалить эту транзакцию?")) {
      dispatch(deleteTransaction(id))
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedTransaction(null)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(amount)
  }

  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const recentTransactions = sortedTransactions.slice(0, 10)

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Главная</h1>

      <div className={styles.summaryCards}>
        <div className={styles.balanceCard}>
          <h2 className={styles.cardTitle}>Текущий баланс</h2>
          <p className={styles.balanceAmount}>{formatCurrency(balance)}</p>
        </div>

        <div className={styles.incomeCard}>
          <h2 className={styles.cardTitle}>Общий доход</h2>
          <p className={styles.incomeAmount}>{formatCurrency(income)}</p>
        </div>

        <div className={styles.expenseCard}>
          <h2 className={styles.cardTitle}>Общие расходы</h2>
          <p className={styles.expenseAmount}>{formatCurrency(expense)}</p>
        </div>
      </div>

      <div className={styles.transactionsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Последние транзакции</h2>
          <button onClick={handleAddTransaction} className={styles.addButton}>
            Добавить транзакцию
          </button>
        </div>

        {loading ? (
          <p className={styles.loading}>Загрузка транзакций...</p>
        ) : (
          <TransactionList
            transactions={recentTransactions}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <TransactionForm transaction={selectedTransaction || undefined} onClose={closeModal} />
      </Modal>
    </div>
  )
}

export default DashboardPage
