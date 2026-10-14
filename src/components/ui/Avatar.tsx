interface AvatarProps {
  src?: string
  alt?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeStyles = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-16 h-16",
}

export default function Avatar({
  src,
  alt = "",
  size = "md",
  className = "",
}: AvatarProps) {
  return (
    <div
      className={`rounded-full border border-brand-card-border bg-white flex items-center justify-center overflow-hidden ${sizeStyles[size]} ${className}`}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="text-brand-accent font-semibold text-sm">
          {alt.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  )
}
