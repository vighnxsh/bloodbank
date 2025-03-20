import DonorForm from "@/components/donors/DonorForm"

export const metadata = {
  title: "Add New Donor | Blood Donation Management",
  description: "Add a new blood donor to the system",
}

export default function NewDonorPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Add New Donor</h1>
      <DonorForm />
    </div>
  )
} 