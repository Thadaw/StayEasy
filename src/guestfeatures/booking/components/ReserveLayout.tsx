import { ReactNode } from 'react'

interface ReserveLayoutProps {
  leftColumn: ReactNode
  rightColumn: ReactNode
}

export function ReserveLayout({ leftColumn, rightColumn }: ReserveLayoutProps) {
  return (
    <div className="mx-auto grid w-full max-w-[1250px] grid-cols-1 gap-4 px-3.5 py-4 pb-10 sm:px-6 sm:py-5 lg:grid-cols-[1fr_600px] lg:gap-[26px]">
      <div className="space-y-5">
        {leftColumn}
      </div>
      <div className="w-full lg:max-w-[600px]">
        {rightColumn}
      </div>
    </div>
  )
}
