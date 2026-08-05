import { type ReactNode } from "react";

interface StickySearchHeaderProps {
  children: ReactNode;
}

export function StickySearchHeader({ children }: StickySearchHeaderProps) {
  return (
    <div className="sticky top-0 z-40 w-full px-4 sm:px-6 pt-3 bg-background">
      {children}
    </div>
  );
}
