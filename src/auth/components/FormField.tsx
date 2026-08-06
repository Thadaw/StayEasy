import { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  children: ReactNode
  className?: string
}

export function FormField({ label, children, className = '' }: FormFieldProps) {
  return (
    <div className={`relative mb-[7px] ${className}`}>
      <label className="text-[11px] text-[#666] mb-[3px] block uppercase tracking-[0.4px]">
        {label}
      </label>
      {children}
    </div>
  )
}
