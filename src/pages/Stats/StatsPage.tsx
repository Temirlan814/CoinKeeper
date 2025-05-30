"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {useDispatch, useSelector} from "react-redux"
import type {AppDispatch, RootState} from "../../store"
import {fetchTransactions, Transaction} from "../../store/slices/transactionSlice"
import Card from "../../components/UI/Card/Card"
import Input from "../../components/UI/Input/Input"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import styles from "./StatsPage.module.css"
import {fetchCategories} from "../../store/slices/categorySlice.ts";

interface ChartData {
  name: string
  value: number
  color: string
}

const StatsPage: React.FC = () => {
  const { transactions } = useSelector((state: RootState) => state.transactions)
  const { categories } = useSelector((state: RootState) => state.categories)
  const { user } = useSelector((state: RootState) => state.auth)

  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date()
    date.setMonth(date.getMonth() - 1)
    return date.toISOString().split("T")[0]
  })

  const [endDate, setEndDate] = useState<string>(() => {
    return new Date().toISOString().split("T")[0]
  })

  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [incomeData, setIncomeData] = useState<ChartData[]>([])
  const [expenseData, setExpenseData] = useState<ChartData[]>([])
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (user) {
      dispatch(fetchTransactions(user.id))
      dispatch(fetchCategories(user.id))
    }
  }, [dispatch, user])

  useEffect(() => {
    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date)
      const start = new Date(startDate)
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)

      return transactionDate >= start && transactionDate <= end
    })

    setFilteredTransactions(filtered)
  }, [transactions, startDate, endDate])

  useEffect(() => {
    const incomeByCategory: Record<number, number> = {}
    const expenseByCategory: Record<number, number> = {}

    filteredTransactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeByCategory[transaction.categoryId] = (incomeByCategory[transaction.categoryId] || 0) + transaction.amount
      } else {
        expenseByCategory[transaction.categoryId] =
          (expenseByCategory[transaction.categoryId] || 0) + transaction.amount
      }
    })

    const incomeChartData: ChartData[] = []
    const expenseChartData: ChartData[] = []

    categories.forEach((category) => {
      if (category.type === "income" && incomeByCategory[category.id]) {
        incomeChartData.push({
          name: category.name,
          value: incomeByCategory[category.id],
          color: category.color || "#4a6fa5",
        })
      } else if (category.type === "expense" && expenseByCategory[category.id]) {
        expenseChartData.push({
          name: category.name,
          value: expenseByCategory[category.id],
          color: category.color || "#4a6fa5",
        })
      }
    })

    setIncomeData(incomeChartData)
    setExpenseData(expenseChartData)
  }, [filteredTransactions, categories])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(value)
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{payload[0].name}</p>
          <p className={styles.tooltipValue}>{formatCurrency(payload[0].value)}</p>
        </div>
      )
    }

    return null
  }

  return (
    <div className={styles.statsPage}>
      <h1 className={styles.title}>Статистика</h1>

      <Card className={styles.filterCard}>
        <div className={styles.dateFilters}>
          <Input label="Начальная дата" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <Input label="Конечная дата" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </Card>

      <div className={styles.chartsContainer}>
        <Card className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Доходы по категориям</h2>
          {incomeData.length > 0 ? (
            <div className={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={incomeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {incomeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className={styles.chartLegend}>
                {incomeData.map((entry, index) => (
                  <div key={index} className={styles.legendItem}>
                    <div className={styles.legendColor} style={{ backgroundColor: entry.color }}></div>
                    <span className={styles.legendName}>{entry.name}</span>
                    <span className={styles.legendValue}>{formatCurrency(entry.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className={styles.noData}>Нет данных о доходах за выбранный период.</p>
          )}
        </Card>

        <Card className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Расходы по категориям</h2>
          {expenseData.length > 0 ? (
            <div className={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className={styles.chartLegend}>
                {expenseData.map((entry, index) => (
                  <div key={index} className={styles.legendItem}>
                    <div className={styles.legendColor} style={{ backgroundColor: entry.color }}></div>
                    <span className={styles.legendName}>{entry.name}</span>
                    <span className={styles.legendValue}>{formatCurrency(entry.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className={styles.noData}>Нет данных о расходах за выбранный период.</p>
          )}
        </Card>

        <Card className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Доходы и расходы</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                {
                  name: "Доходы",
                  amount: incomeData.reduce((sum, item) => sum + item.value, 0),
                  color: "#4caf50",
                },
                {
                  name: "Расходы",
                  amount: expenseData.reduce((sum, item) => sum + item.value, 0),
                  color: "#f44336",
                },
              ]}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
              <Bar dataKey="amount" name="Сумма" fill="#8884d8">
                {[
                  { name: "Доходы", color: "#4caf50" },
                  { name: "Расходы", color: "#f44336" },
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}

export default StatsPage
