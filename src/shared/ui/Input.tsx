import { ReactNode } from "react"

interface InputProps {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  type?: string
  icon?: ReactNode
  disabled?: boolean
  required?: boolean
  className?: string
}

export default function Input({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  type = "text",
  icon,
  disabled,
  required,
  className = "",
}: InputProps) {
  return (
    <div className={`flex-1 max-w-[220px] ${className}`}>
      {label && (
        <label className="block text-xs font-medium text-brand-text-secondary mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-secondary">
            {icon}
          </span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className={`w-full px-3 py-1.5 text-sm border border-brand-card-border rounded-lg outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent text-brand-heading ${icon ? "pl-9" : ""}`}
        />
      </div>
    </div>
  )
}
