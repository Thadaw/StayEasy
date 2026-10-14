import { ReactNode } from "react"

type ButtonVariant = "primary" | "outline" | "danger" | "ghost" | "danger-outline"
type ButtonSize = "sm" | "md" | "lg"

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode
  className?: string
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-accent text-white hover:bg-brand-accent-hover disabled:opacity-50",
  outline:
    "border border-gray-200 bg-white text-gray-900 hover:border-brand-accent",
  danger: "bg-red-600 text-white hover:bg-red-700 disabled:opacity-50",
  ghost: "border border-brand-card-border bg-white text-brand-text-secondary hover:bg-brand-secondary-surface",
  "danger-outline":
    "border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50",
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 py-2 text-sm rounded-lg",
  lg: "w-full py-2.5 text-sm rounded-lg",
}

export default function Button({
  children,
  onClick,
  disabled,
  loading,
  variant = "outline",
  size = "md",
  icon,
  className = "",
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-colors cursor-pointer ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        icon
      )}
      {children}
    </button>
  )
}
