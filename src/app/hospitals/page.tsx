import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Hospitals | Blood Donation Management",
  description: "Manage partner hospitals",
}

export default function HospitalsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Hospitals</h1>
        <Link href="/hospitals/new">
          <Button>Add New Hospital</Button>
        </Link>
      </div>
      
      <div className="rounded-md border p-8 flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-semibold mb-4">Hospital Management</h2>
        <p className="text-muted-foreground mb-8 max-w-lg">
          This section will display a list of all partner hospitals. You can add new hospitals, update existing ones, and view their blood request history.
        </p>
        <p className="mb-4 text-sm">
          Coming soon: Complete hospital management functionality
        </p>
        <Link href="/">
          <Button variant="outline">Return to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
} 