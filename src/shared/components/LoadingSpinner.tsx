interface LoadingSpinnerProps {
  className?: string;
}

export function LoadingSpinner({ className = "" }: LoadingSpinnerProps) {
  return (
    <span
      className={`w-8 h-8 rounded-full border-3 border-gray-200 border-t-brand-accent animate-spin ${className}`}
    />
  );
}
