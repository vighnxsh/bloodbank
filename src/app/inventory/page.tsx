import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Blood Inventory | Blood Donation Management",
  description: "Manage blood inventory",
}

export default function InventoryPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blood Inventory</h1>
        <div className="space-x-2">
          <Link href="/inventory/add">
            <Button variant="outline">Add to Inventory</Button>
          </Link>
          <Link href="/inventory/report">
            <Button>Generate Report</Button>
          </Link>
        </div>
      </div>
      
      <div className="rounded-md border p-8 flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-semibold mb-4">Inventory Management</h2>
        <p className="text-muted-foreground mb-8 max-w-lg">
          This section will display the current blood inventory. You can view available units by blood type, expiry dates, and manage inventory levels.
        </p>
        <p className="mb-4 text-sm">
          Coming soon: Complete inventory management functionality
        </p>
        <Link href="/">
          <Button variant="outline">Return to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}