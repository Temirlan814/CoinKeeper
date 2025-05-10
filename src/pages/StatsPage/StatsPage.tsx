"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../../store"
import type { Transaction } from "../../store/slices/transactionSlice"
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

interface ChartData {
  name: string
  value: number
  color: string
}

const StatsPage: React.FC = () => {
  const { transactions } = useSelector((state: RootState) => state.transactions)
  const { categories } = useSelector((state: RootState) => state.categories)

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
      useGrouping: true,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }
  const formatYAxis = (value: number) =>
      new Intl.NumberFormat("ru-RU", {
        useGrouping: true,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value)


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

      <div className={styles.filterCard}>
        <div className={styles.dateFilters}>
          <div className={styles.inputContainer}>
            <label htmlFor="startDate" className={styles.label}>Начальная дата</label>
            <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={styles.input}
            />
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="endDate" className={styles.label}>Конечная дата</label>
            <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={styles.input}
            />
          </div>
        </div>
      </div>


      <div className={styles.chartsContainer}>
        <div className={styles.chartCard}>
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
        </div>

        <div  className={styles.chartCard}>
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
        </div >

        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Доходы и расходы</h2>
          <div className={styles.chartWrapper}>
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
                <YAxis tickFormatter={formatYAxis} />
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
          </div>
        </div>

      </div>
    </div>
  )
}

export default StatsPage
