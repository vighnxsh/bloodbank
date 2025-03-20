import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Blood Requests | Blood Donation Management",
  description: "Manage blood requests from hospitals",
}

export default function RequestsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blood Requests</h1>
        <Link href="/requests/new">
          <Button>New Request</Button>
        </Link>
      </div>
      
      <div className="rounded-md border p-8 flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-semibold mb-4">Blood Request Management</h2>
        <p className="text-muted-foreground mb-8 max-w-lg">
          This section will display all blood requests from hospitals. You can approve or reject requests and track their status.
        </p>
        <p className="mb-4 text-sm">
          Coming soon: Complete blood request management functionality
        </p>
        <Link href="/">
          <Button variant="outline">Return to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
} 