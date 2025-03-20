import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-primary/70">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Resource Not Found</h2>
      <p className="mt-2 text-muted-foreground">
        The resource you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className="mt-8">
        <Button>Return to Dashboard</Button>
      </Link>
    </div>
  )
} 