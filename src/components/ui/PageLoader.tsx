import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center font-jakarta">
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner className="border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
