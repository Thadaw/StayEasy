import { ReactNode } from 'react'

interface ReserveLayoutProps {
  leftColumn: ReactNode
  rightColumn: ReactNode
}

export function ReserveLayout({ leftColumn, rightColumn }: ReserveLayoutProps) {
  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6">
      <div className="lg:hidden space-y-5">
        {leftColumn}
        {rightColumn}
      </div>

      <div className="hidden lg:grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        <div className="space-y-5">
          {leftColumn}
        </div>
        <div className="lg:sticky lg:top-24 self-start">
          {rightColumn}
        </div>
      </div>
    </div>
  )
}
