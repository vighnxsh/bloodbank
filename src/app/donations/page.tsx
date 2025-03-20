import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Donations | Blood Donation Management",
  description: "Manage blood donations",
}

export default function DonationsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Donations</h1>
        <Link href="/donations/new">
          <Button>Record New Donation</Button>
        </Link>
      </div>
      
      <div className="rounded-md border p-8 flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-semibold mb-4">Donations Management</h2>
        <p className="text-muted-foreground mb-8 max-w-lg">
          This section will display a list of all blood donations. You can add a new donation record or view details of existing donations.
        </p>
        <p className="mb-4 text-sm">
          Coming soon: Complete donation management functionality
        </p>
        <Link href="/">
          <Button variant="outline">Return to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}