import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface PasswordInputProps {
  value: string
  onChange: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
  placeholder?: string
  className?: string
}

export function PasswordInput({ value, onChange, onFocus, onBlur, placeholder = '••••••••', className = '' }: PasswordInputProps) {
  const [showPw, setShowPw] = useState(true)

  return (
    <div className={`relative ${className}`}>
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
