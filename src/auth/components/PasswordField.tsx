import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface PasswordFieldProps {
  label?: string
  value: string
  onChange: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
  placeholder?: string
  className?: string
}

export function PasswordField({ label = 'Password', value, onChange, onFocus, onBlur, placeholder = '••••••••', className = '' }: PasswordFieldProps) {
  const [showPw, setShowPw] = useState(true)

  return (
    <div className={`relative mb-[7px] ${className}`}>
      <label className="text-[11px] text-[#666] mb-[3px] block uppercase tracking-[0.4px]">
        {label}
      </label>
      <input
        type={showPw ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full border-none border-b-[1.5px] border-b-[#ddd] py-[7px] pr-[26px] text-sm text-black outline-none bg-transparent"
      />
      <button
        type="button"
        onClick={() => setShowPw(p => !p)}
        aria-label="Toggle password visibility"
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[#bbb] text-[15px] p-0"
      >
        {showPw ? <Eye size={15} /> : <EyeOff size={15} />}
      </button>
    </div>
  )
}
