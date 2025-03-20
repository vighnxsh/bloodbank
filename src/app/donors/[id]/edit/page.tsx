import { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import DonorForm from "@/components/donors/DonorForm"

interface EditDonorPageProps {
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  title: "Edit Donor | Blood Donation Management",
  description: "Edit donor information",
}

async function getDonor(id: string) {
  const donorId = parseInt(id)
  
  if (isNaN(donorId)) {
    return null
  }
  
  try {
    return await db.donor.findUnique({
      where: { id: donorId }
    })
  } catch (error) {
    console.error("Error fetching donor:", error)
    return null
  }
}

export default async function EditDonorPage({ params }: EditDonorPageProps) {
  const donor = await getDonor(params.id)
  
  if (!donor) {
    notFound()
  }
  
  // Convert dates to ISO strings for the form
  const donorData = {
    ...donor,
    lastDonated: donor.lastDonated ? new Date(donor.lastDonated) : null,
  }
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Edit Donor</h1>
      <DonorForm initialData={donorData} />
    </div>
  )
} 