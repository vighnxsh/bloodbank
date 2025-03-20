import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { 
  Calendar, 
  ClipboardCheck, 
  DropletIcon, 
  Edit2, 
  Eye, 
  Heart, 
  Phone, 
  Mail, 
  ArrowLeft, 
  CalendarDays, 
  User 
} from "lucide-react"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  bloodInventory: Array<{ id: number, bloodType: string, units: number, expiryDate: string | Date }>
  createdAt: string | Date
  updatedAt: string | Date
}

const bloodTypeColors: Record<string, string> = {
  "A+": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  "A-": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  "B+": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "B-": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "AB+": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  "AB-": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  "O+": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "O-": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
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

function getInitials(name: string) {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export default async function DonorPage({ params }: DonorPageProps) {
  const donor = await getDonor(params.id)
  
  if (!donor) {
    notFound()
  }
  
  const totalDonations = donor.donations.length;
  const totalUnits = donor.donations.reduce((total: number, donation: Donation) => total + donation.quantity, 0);
  const lastDonationDate = totalDonations > 0 ? new Date(donor.donations[0].donationDate) : null;
  const daysSinceLastDonation = lastDonationDate 
    ? Math.floor((new Date().getTime() - lastDonationDate.getTime()) / (1000 * 3600 * 24))
    : null;
  
  const eligibleToDonateSoon = daysSinceLastDonation && daysSinceLastDonation > 56; // 8 weeks
  const recentlyDonated = daysSinceLastDonation && daysSinceLastDonation < 14;
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-8 gap-2">
        <Button variant="outline" size="icon" className="h-8 w-8 mr-2" asChild>
          <Link href="/donors">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Donor Details</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="col-span-1">
          <div className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                    {getInitials(donor.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-2 mb-4">
                  <h2 className="text-2xl font-bold">{donor.name}</h2>
                  <div className="flex justify-center">
                    <Badge 
                      variant="outline" 
                      className={`${bloodTypeColors[donor.bloodType]} border-none text-sm px-3 py-1`}
                    >
                      {donor.bloodType}
                    </Badge>
                  </div>
                </div>
                
                <div className="w-full space-y-3">
                  <div className="flex items-center text-sm">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{donor.age} years old</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{donor.contact}</span>
                  </div>
                  
                  {donor.email && (
                    <div className="flex items-center text-sm">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{donor.email}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Registered on {format(new Date(donor.createdAt), "PPP")}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-6 w-full">
                  <Button className="flex-1" variant="outline" asChild>
                    <Link href={`/donors/${params.id}/edit`} className="flex items-center justify-center gap-1">
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  
                  <Button className="flex-1" asChild>
                    <Link href={`/donations/new?donorId=${donor.id}`} className="flex items-center justify-center gap-1">
                      <DropletIcon className="h-4 w-4" />
                      Donate
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Donation Status Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-md flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" />
                  Donation Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Last Donated</span>
                    <span className="font-medium">
                      {lastDonationDate 
                        ? format(lastDonationDate, "d MMM yyyy")
                        : "Never"}
                    </span>
                  </div>
                  
                  {daysSinceLastDonation !== null && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Days Since</span>
                      <span className="font-medium">{daysSinceLastDonation} days</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Eligibility</span>
                    <Badge className={recentlyDonated 
                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800" 
                      : eligibleToDonateSoon 
                        ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800"
                    }>
                      {recentlyDonated 
                        ? "Recently Donated" 
                        : eligibleToDonateSoon 
                          ? "Eligible" 
                          : lastDonationDate ? "Not Yet Eligible" : "Ready to Donate"}
                    </Badge>
                  </div>
                  
                  {lastDonationDate && daysSinceLastDonation !== null && !eligibleToDonateSoon && !recentlyDonated && (
                    <div className="pt-2">
                      <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
                        <div 
                          className="bg-primary h-full" 
                          style={{ width: `${(daysSinceLastDonation / 56) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>0 days</span>
                        <span>56 days</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="col-span-1 lg:col-span-3 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-primary" />
                Donation Summary
              </CardTitle>
              <CardDescription>Overview of donation history and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground">Total Donations</p>
                    <div className="flex items-end gap-1">
                      <p className="text-3xl font-bold">{totalDonations}</p>
                      <p className="text-sm text-muted-foreground pb-1">times</p>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground">Total Units</p>
                    <div className="flex items-end gap-1">
                      <p className="text-3xl font-bold">{totalUnits}</p>
                      <p className="text-sm text-muted-foreground pb-1">units</p>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground">Last Donation</p>
                    <div className="flex items-end gap-1">
                      <p className="text-xl font-bold">
                        {lastDonationDate 
                          ? format(lastDonationDate, "d MMM yyyy")
                          : "Never donated"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="history" className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-4">
              <TabsTrigger value="history" className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                Donation History
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex items-center gap-1">
                <ClipboardCheck className="h-4 w-4" />
                Timeline
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="history">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Donation Records</CardTitle>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/donations/new?donorId=${donor.id}`}>
                        Record New Donation
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {donor.donations.length === 0 ? (
                    <div className="text-center py-12 border rounded-md">
                      <DropletIcon className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-1">No donation records</h3>
                      <p className="text-sm text-muted-foreground">
                        This donor hasn&apos;t made any blood donations yet.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <table className="min-w-full divide-y divide-border">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Quantity</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Inventory Status</th>
                            <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {donor.donations.map((donation: Donation) => (
                            <tr key={donation.id} className="hover:bg-muted/30 transition-colors">
                              <td className="px-4 py-3">
                                <div className="flex flex-col">
                                  <time className="font-medium" dateTime={donation.donationDate.toString()}>
                                    {format(new Date(donation.donationDate), "d MMM yyyy")}
                                  </time>
                                  <span className="text-xs text-muted-foreground">
                                    {format(new Date(donation.donationDate), "h:mm a")}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1.5">
                                  <Badge variant="outline" className="bg-primary/10 text-primary border-none">
                                    {donation.quantity} units
                                  </Badge>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <Badge className={donation.bloodInventory.length === 0 
                                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" 
                                  : "bg-green-100 text-green-800 hover:bg-green-100"
                                }>
                                  {donation.bloodInventory.length === 0 
                                    ? "Not in inventory" 
                                    : `${donation.bloodInventory.length} units tracked`}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <Button size="icon" variant="ghost" asChild>
                                  <Link href={`/donations/${donation.id}`}>
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="timeline">
              <Card>
                <CardHeader>
                  <CardTitle>Donation Timeline</CardTitle>
                  <CardDescription>Visual history of blood donations</CardDescription>
                </CardHeader>
                <CardContent>
                  {donor.donations.length === 0 ? (
                    <div className="text-center py-12 border rounded-md">
                      <CalendarDays className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-1">No donation history</h3>
                      <p className="text-sm text-muted-foreground">
                        There&apos;s no timeline to display as this donor hasn&apos;t made any donations yet.
                      </p>
                    </div>
                  ) : (
                    <div className="relative pl-8 space-y-8 before:absolute before:inset-y-0 before:left-4 before:ml-px before:border-l before:border-border">
                      {donor.donations.map((donation: Donation) => (
                        <div key={donation.id} className="relative">
                          <div className="absolute left-0 top-1 -translate-x-1/2 -translate-y-1/4 p-1 rounded-full bg-primary/10 border-4 border-background">
                            <DropletIcon className="h-3 w-3 text-primary" />
                          </div>
                          
                          <div className="rounded-lg border bg-card p-4">
                            <time className="text-sm font-semibold text-primary mb-1 block">
                              {format(new Date(donation.donationDate), "PPPP")}
                            </time>
                            
                            <div className="flex flex-wrap gap-3 mb-2">
                              <Badge variant="outline" className="bg-primary/10 text-primary border-none">
                                {donation.quantity} units
                              </Badge>
                              
                              {donation.bloodInventory.length > 0 ? (
                                <Badge className="bg-green-100 text-green-800">
                                  In Inventory
                                </Badge>
                              ) : (
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  Not in Inventory
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex justify-end">
                              <Button variant="ghost" size="sm" className="h-8" asChild>
                                <Link href={`/donations/${donation.id}`}>
                                  View Details
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}