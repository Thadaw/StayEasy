import { ReactNode } from "react"

interface BadgeProps {
  children: ReactNode
  variant?: "default" | "success" | "warning" | "danger" | "info"
  size?: "sm" | "md"
  className?: string
}

const variantStyles = {
  default:
    "border-brand-card-border bg-white text-brand-text-secondary hover:bg-brand-secondary-surface",
  success: "border-green-200 bg-green-50 text-green-700",
  warning: "border-yellow-200 bg-yellow-50 text-yellow-700",
  danger:
    "border-brand-card-border bg-white text-brand-danger hover:bg-brand-danger-light",
  info: "border-blue-200 bg-blue-50 text-blue-700",
}

const sizeStyles = {
  sm: "text-[10px] px-2 py-1",
  md: "text-xs px-3 py-1.5",
}

export default function Badge({
  children,
  variant = "default",
  size = "sm",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-lg border transition-colors cursor-pointer ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  )
}
