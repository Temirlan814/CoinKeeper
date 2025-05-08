import type { Category } from "../store/slices/categorySlice"

// Функция для создания стандартных категорий для нового пользователя
export const createDefaultCategories = (userId: number): Omit<Category, "id">[] => {
  return [
    {
      name: "Зарплата",
      type: "income",
      color: "#4caf50",
      icon: "money",
      userId,
    },
    {
      name: "Фриланс",
      type: "income",
      color: "#2196f3",
      icon: "work",
      userId,
    },
    {
      name: "Инвестиции",
      type: "income",
      color: "#9c27b0",
      icon: "trending_up",
      userId,
    },
    {
      name: "Продукты",
      type: "expense",
      color: "#f44336",
      icon: "shopping_cart",
      userId,
    },
    {
      name: "Аренда",
      type: "expense",
      color: "#ff9800",
      icon: "home",
      userId,
    },
    {
      name: "Развлечения",
      type: "expense",
      color: "#58365e",
      icon: "movie",
      userId,
    },
    {
      name: "Транспорт",
      type: "expense",
      color: "#607d8b",
      icon: "directions_car",
      userId,
    },
    {
      name: "Коммунальные услуги",
      type: "expense",
      color: "#795548",
      icon: "power",
      userId,
    },
    {
      name: "Здоровье",
      type: "expense",
      color: "#e91e63",
      icon: "favorite",
      userId,
    },
    {
      name: "Образование",
      type: "expense",
      color: "#3f51b5",
      icon: "school",
      userId,
    },
  ]
}
