"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchTransactions, deleteTransaction, type Transaction } from "../../store/slices/transactionSlice"
import { fetchCategories } from "../../store/slices/categorySlice"
import type { RootState, AppDispatch } from "../../store"
import Card from "../../components/UI/Card/Card"
import Button from "../../components/UI/Button/Button"
import Input from "../../components/UI/Input/Input"
import Select from "../../components/UI/Select/Select"
import TransactionList from "../../components/TransactionList/TransactionList"
import TransactionForm from "../../components/TransactionForm/TransactionForm"
import Modal from "../../components/Modal/Modal"
import styles from "./DashboardPage.module.css"

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { transactions, loading } = useSelector((state: RootState) => state.transactions)
  const { categories } = useSelector((state: RootState) => state.categories)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [balance, setBalance] = useState(0)
  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)

  // Новые состояния для фильтрации и разделения доходов/расходов
  const [activeTab, setActiveTab] = useState<"all" | "income" | "expense">("all")
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    categoryId: "",
    minAmount: "",
    maxAmount: "",
  })
  const [isFilterVisible, setIsFilterVisible] = useState(false)

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

  // Эффект для фильтрации транзакций
  useEffect(() => {
    let filtered = [...transactions]

    // Фильтрация по типу (доходы/расходы/все)
    if (activeTab !== "all") {
      filtered = filtered.filter((transaction) => transaction.type === activeTab)
    }

    // Фильтрация по дате начала
    if (filters.startDate) {
      const startDate = new Date(filters.startDate)
      filtered = filtered.filter((transaction) => new Date(transaction.date) >= startDate)
    }

    // Фильтрация по дате окончания
    if (filters.endDate) {
      const endDate = new Date(filters.endDate)
      endDate.setHours(23, 59, 59, 999) // Устанавливаем конец дня
      filtered = filtered.filter((transaction) => new Date(transaction.date) <= endDate)
    }

    // Фильтрация по категории
    if (filters.categoryId) {
      filtered = filtered.filter((transaction) => transaction.categoryId === Number.parseInt(filters.categoryId))
    }

    // Фильтрация по минимальной сумме
    if (filters.minAmount) {
      filtered = filtered.filter((transaction) => transaction.amount >= Number.parseFloat(filters.minAmount))
    }

    // Фильтрация по максимальной сумме
    if (filters.maxAmount) {
      filtered = filtered.filter((transaction) => transaction.amount <= Number.parseFloat(filters.maxAmount))
    }

    // Сортировка по дате (сначала новые)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    setFilteredTransactions(filtered)
  }, [transactions, activeTab, filters])

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

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const resetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      categoryId: "",
      minAmount: "",
      maxAmount: "",
    })
  }

  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible)
  }

  // Получаем категории в зависимости от активной вкладки
  const getFilterCategories = () => {
    if (activeTab === "all") {
      return categories
    }
    return categories.filter((category) => category.type === activeTab)
  }

  return (
      <div className={styles.dashboard}>
        <h1 className={styles.title}>Главная</h1>

        <div className={styles.summaryCards}>
          <Card className={styles.balanceCard}>
            <h2 className={styles.cardTitle}>Текущий баланс</h2>
            <p className={styles.balanceAmount}>{formatCurrency(balance)}</p>
          </Card>

          <Card className={styles.incomeCard}>
            <h2 className={styles.cardTitle}>Общий доход</h2>
            <p className={styles.incomeAmount}>{formatCurrency(income)}</p>
          </Card>

          <Card className={styles.expenseCard}>
            <h2 className={styles.cardTitle}>Общие расходы</h2>
            <p className={styles.expenseAmount}>{formatCurrency(expense)}</p>
          </Card>
        </div>

        <div className={styles.transactionsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Транзакции</h2>
            <div className={styles.actionButtons}>
              <Button onClick={toggleFilterVisibility} variant="secondary">
                {isFilterVisible ? "Скрыть фильтры" : "Показать фильтры"}
              </Button>
              <Button onClick={handleAddTransaction}>Добавить транзакцию</Button>
            </div>
          </div>

          {isFilterVisible && (
              <Card className={styles.filterCard}>
                <div className={styles.filterGrid}>
                  <div className={styles.filterItem}>
                    <Input
                        label="Дата с"
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                        fullWidth
                    />
                  </div>
                  <div className={styles.filterItem}>
                    <Input
                        label="Дата по"
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                        fullWidth
                    />
                  </div>
                  <div className={styles.filterItem}>
                    <Select
                        label="Категория"
                        name="categoryId"
                        value={filters.categoryId}
                        onChange={handleFilterChange}
                        options={[
                          { value: "", label: "Все категории" },
                          ...getFilterCategories().map((cat) => ({
                            value: cat.id.toString(),
                            label: cat.name,
                          })),
                        ]}
                        fullWidth
                    />
                  </div>
                  <div className={styles.filterItem}>
                    <Input
                        label="Мин. сумма"
                        type="number"
                        name="minAmount"
                        value={filters.minAmount}
                        onChange={handleFilterChange}
                        placeholder="От"
                        fullWidth
                    />
                  </div>
                  <div className={styles.filterItem}>
                    <Input
                        label="Макс. сумма"
                        type="number"
                        name="maxAmount"
                        value={filters.maxAmount}
                        onChange={handleFilterChange}
                        placeholder="До"
                        fullWidth
                    />
                  </div>
                  <div className={styles.resetFilterButton}>
                    <Button onClick={resetFilters} variant="secondary">
                      Сбросить фильтры
                    </Button>
                  </div>
                </div>
              </Card>
          )}

          <div className={styles.tabs}>
            <button
                className={`${styles.tab} ${activeTab === "all" ? styles.activeTab : ""}`}
                onClick={() => setActiveTab("all")}
            >
              Все транзакции
            </button>
            <button
                className={`${styles.tab} ${activeTab === "income" ? styles.activeTab : ""}`}
                onClick={() => setActiveTab("income")}
            >
              Доходы
            </button>
            <button
                className={`${styles.tab} ${activeTab === "expense" ? styles.activeTab : ""}`}
                onClick={() => setActiveTab("expense")}
            >
              Расходы
            </button>
          </div>

          {loading ? (
              <p className={styles.loading}>Загрузка транзакций...</p>
          ) : filteredTransactions.length > 0 ? (
              <TransactionList
                  transactions={filteredTransactions}
                  onEdit={handleEditTransaction}
                  onDelete={handleDeleteTransaction}
              />
          ) : (
              <p className={styles.emptyMessage}>
                {activeTab === "all"
                    ? "Транзакции не найдены."
                    : activeTab === "income"
                        ? "Доходы не найдены."
                        : "Расходы не найдены."}
                {Object.values(filters).some((value) => value !== "") && " Попробуйте изменить параметры фильтрации."}
              </p>
          )}
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <TransactionForm transaction={selectedTransaction || undefined} onClose={closeModal} />
        </Modal>
      </div>
  )
}

export default DashboardPage
