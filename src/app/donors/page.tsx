import Link from "next/link"
import { Button } from "@/components/ui/button"
import DonorsList from "@/components/donors/DonorsList"

export const metadata = {
  title: "Donors | Blood Donation Management",
  description: "Manage blood donors",
}

export default function DonorsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Donors</h1>
        <Link href="/donors/new">
          <Button>Add New Donor</Button>
        </Link>
      </div>
      
      <DonorsList />
    </div>
  )
} 