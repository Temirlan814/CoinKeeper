import type React from "react"
import type { ReactNode } from "react"
import styles from "./Card.module.css"

interface CardProps {
  children: ReactNode
  title?: string
  className?: string
}

const Card: React.FC<CardProps> = ({ children, title, className = "" }) => {
  return (
    <div className={`${styles.card} ${className}`}>
      {title && <div className={styles.cardTitle}>{title}</div>}
      <div className={styles.cardContent}>{children}</div>
    </div>
  )
}

export default Card
