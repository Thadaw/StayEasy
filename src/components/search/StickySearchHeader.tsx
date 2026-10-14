import { type ReactNode } from "react";

interface StickySearchHeaderProps {
  children: ReactNode;
}

export function StickySearchHeader({ children }: StickySearchHeaderProps) {
  return (
    <div className="sticky top-0 z-40 w-full pt-3 bg-background">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        {children}
      </div>
    </div>
  );
}
