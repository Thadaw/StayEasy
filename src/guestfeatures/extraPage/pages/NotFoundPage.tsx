import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center font-jakarta">
      <p className="text-6xl">🔍</p>
      <h1 className="text-2xl font-bold text-foreground">Page not found</h1>
      <p className="text-sm text-muted-foreground max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="px-5 py-2.5 bg-primary text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
        Back to home
      </Link>
    </div>
  );
}
