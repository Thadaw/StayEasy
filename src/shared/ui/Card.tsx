import { ReactNode } from "react"

interface CardProps {
  children: ReactNode
  className?: string
  padding?: "none" | "sm" | "md" | "lg"
}

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
}

export default function Card({
  children,
  className = "",
  padding = "md",
}: CardProps) {
  return (
    <div
      className={`bg-white border border-brand-card-border rounded-xl ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </div>
  )
}
