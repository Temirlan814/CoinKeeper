"use client"

import type React from "react"

import { useState } from "react"
import styles from "./IconSelector.module.css"

export const availableIcons = [
  { id: "wallet", name: "Кошелек", emoji: "💰" },
  { id: "salary", name: "Зарплата", emoji: "💵" },
  { id: "gift", name: "Подарок", emoji: "🎁" },
  { id: "investment", name: "Инвестиции", emoji: "📈" },
  { id: "food", name: "Еда", emoji: "🍔" },
  { id: "groceries", name: "Продукты", emoji: "🛒" },
  { id: "restaurant", name: "Ресторан", emoji: "🍽️" },
  { id: "cafe", name: "Кафе", emoji: "☕" },
  { id: "transport", name: "Транспорт", emoji: "🚌" },
  { id: "taxi", name: "Такси", emoji: "🚕" },
  { id: "car", name: "Автомобиль", emoji: "🚗" },
  { id: "home", name: "Дом", emoji: "🏠" },
  { id: "rent", name: "Аренда", emoji: "🏢" },
  { id: "utilities", name: "Коммунальные услуги", emoji: "💡" },
  { id: "phone", name: "Телефон", emoji: "📱" },
  { id: "internet", name: "Интернет", emoji: "🌐" },
  { id: "entertainment", name: "Развлечения", emoji: "🎭" },
  { id: "movie", name: "Кино", emoji: "🎬" },
  { id: "game", name: "Игры", emoji: "🎮" },
  { id: "sport", name: "Спорт", emoji: "⚽" },
  { id: "health", name: "Здоровье", emoji: "💊" },
  { id: "doctor", name: "Врач", emoji: "🩺" },
  { id: "education", name: "Образование", emoji: "📚" },
  { id: "travel", name: "Путешествия", emoji: "✈️" },
  { id: "clothing", name: "Одежда", emoji: "👕" },
  { id: "beauty", name: "Красота", emoji: "💄" },
  { id: "gift_expense", name: "Подарки", emoji: "🎀" },
  { id: "charity", name: "Благотворительность", emoji: "❤️" },
  { id: "pet", name: "Питомцы", emoji: "🐾" },
  { id: "child", name: "Дети", emoji: "👶" },
  { id: "other", name: "Другое", emoji: "📌" },
  { id: "money", name: "Деньги", emoji: "💵" },
  { id: "work", name: "Работа", emoji: "💼" },
  { id: "trending_up", name: "Рост", emoji: "📈" },
  { id: "shopping_cart", name: "Покупки", emoji: "🛒" },
  { id: "directions_car", name: "Машина", emoji: "🚗" },
  { id: "power", name: "Электричество", emoji: "⚡" },
  { id: "favorite", name: "Здоровье", emoji: "❤️" },
  { id: "school", name: "Школа", emoji: "🏫" },
]

interface IconSelectorProps {
  selectedIcon: string
  onSelectIcon: (iconId: string) => void
}

const IconSelector: React.FC<IconSelectorProps> = ({ selectedIcon, onSelectIcon }) => {
  const [isOpen, setIsOpen] = useState(false)

  // Находим выбранную иконку или используем иконку "other" по умолчанию
  const selectedIconObj =
      availableIcons.find((icon) => icon.id === selectedIcon) ||
      availableIcons.find((icon) => icon.id === "other") ||
      availableIcons[0]

  const toggleSelector = () => {
    setIsOpen(!isOpen)
  }

  const handleSelectIcon = (iconId: string) => {
    onSelectIcon(iconId)
    setIsOpen(false)
  }

  // Получаем только уникальные иконки для отображения (без дубликатов)
  const uniqueIcons = availableIcons.slice(0, 31) // Только основные иконки

  return (
      <div className={styles.iconSelectorContainer}>
        <div className={styles.selectedIcon} onClick={toggleSelector}>
          <span className={styles.iconEmoji}>{selectedIconObj.emoji}</span>
          <span className={styles.iconName}>{selectedIconObj.name}</span>
          <span className={styles.dropdownArrow}>▼</span>
        </div>

        {isOpen && (
            <div className={styles.iconsGrid}>
              {uniqueIcons.map((icon) => (
                  <div
                      key={icon.id}
                      className={`${styles.iconItem} ${selectedIcon === icon.id ? styles.selected : ""}`}
                      onClick={() => handleSelectIcon(icon.id)}
                      title={icon.name}
                  >
                    <span className={styles.iconEmoji}>{icon.emoji}</span>
                  </div>
              ))}
            </div>
        )}
      </div>
  )
}

export default IconSelector
