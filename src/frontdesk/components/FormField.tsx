import type { ReactNode } from "react"

interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  htmlFor?: string
  children: ReactNode
  className?: string
}

export function FormField({
  label,
  error,
  required,
  htmlFor,
  children,
  className = "",
}: FormFieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
