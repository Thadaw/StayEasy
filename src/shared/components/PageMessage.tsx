import { LoadingSpinner } from "./LoadingSpinner"

interface PageMessageProps {
  loading?: boolean
  icon?: string
  title: string
  action?: React.ReactNode
}

export function PageMessage({ loading, icon, title, action }: PageMessageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 font-jakarta">
      {loading ? (
        <LoadingSpinner />
      ) : icon ? (
        <p className="text-2xl">{icon}</p>
      ) : null}
      <p className="text-lg font-semibold text-gray-900">{title}</p>
      {action}
    </div>
  )
}
