import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface DonorPageProps {
  params: {
    id: string
  }
}

interface Donation {
  id: number
  donorId: number
  donationDate: string | Date
  quantity: number
  bloodInventory: any[]
  createdAt: string | Date
  updatedAt: string | Date
}

export async function generateMetadata({ params }: DonorPageProps): Promise<Metadata> {
  const donor = await getDonor(params.id)
  
  if (!donor) {
    return {
      title: "Donor Not Found",
    }
  }
  
  return {
    title: `${donor.name} | Blood Donation Management`,
    description: `Donor details for ${donor.name}`,
  }
}

async function getDonor(id: string) {
  const donorId = parseInt(id)
  
  if (isNaN(donorId)) {
    return null
  }
  
  try {
    return await db.donor.findUnique({
      where: { id: donorId },
      include: {
        donations: {
          include: {
            bloodInventory: true
          },
          orderBy: {
            donationDate: 'desc'
          }
        }
      }
    })
  } catch (error) {
    console.error("Error fetching donor:", error)
    return null
  }
}

export default async function DonorPage({ params }: DonorPageProps) {
  const donor = await getDonor(params.id)
  
  if (!donor) {
    notFound()
  }
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Donor Details</h1>
        <div className="flex items-center gap-4">
          <Link href={`/donors/${params.id}/edit`}>
            <Button variant="outline">Edit Donor</Button>
          </Link>
          <Link href="/donors">
            <Button variant="secondary">Back to Donors</Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Donor's personal and contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{donor.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-medium">{donor.age}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Blood Type</p>
                <p className="font-medium">{donor.bloodType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact</p>
                <p className="font-medium">{donor.contact}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{donor.email || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Donated</p>
                <p className="font-medium">
                  {donor.lastDonated 
                    ? format(new Date(donor.lastDonated), "PPP") 
                    : "Never donated"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Donation Statistics</CardTitle>
            <CardDescription>Overview of donation history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Donations</p>
                <p className="font-medium">{donor.donations.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Donation Date</p>
                <p className="font-medium">
                  {donor.donations.length > 0
                    ? format(new Date(donor.donations[0].donationDate), "PPP")
                    : "No donations yet"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Units Donated</p>
                <p className="font-medium">
                  {donor.donations.reduce((total: number, donation: Donation) => total + donation.quantity, 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date Added</p>
                <p className="font-medium">{format(new Date(donor.createdAt), "PPP")}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <Link href={`/donations/new?donorId=${donor.id}`}>
                <Button className="w-full">Record New Donation</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Donation History</CardTitle>
          <CardDescription>Record of all previous donations</CardDescription>
        </CardHeader>
        <CardContent>
          {donor.donations.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No donation records found.</p>
          ) : (
            <div className="rounded-md border">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Quantity (units)</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Inventory Status</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {donor.donations.map((donation: Donation) => (
                    <tr key={donation.id}>
                      <td className="px-4 py-3 text-sm">
                        {format(new Date(donation.donationDate), "PPP")}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {donation.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {donation.bloodInventory.length === 0 
                          ? "Not in inventory" 
                          : `${donation.bloodInventory.length} units tracked`}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <Link href={`/donations/${donation.id}`}>
                          <Button size="sm" variant="outline">View</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}