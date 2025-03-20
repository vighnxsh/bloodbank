import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex-1">
      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Blood Donation Management System
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Efficiently manage blood donations, inventory, and hospital requests
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="w-full py-12 md:py-16 lg:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tighter mb-8">Dashboard Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/donors" className="block h-full">
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle>Donors</CardTitle>
                  <CardDescription>Manage blood donors information</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Register new donors and view donor history</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View Donors</Button>
                </CardFooter>
              </Card>
            </Link>
            
            <Link href="/donations" className="block h-full">
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle>Donations</CardTitle>
                  <CardDescription>Track blood donation records</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Record and view donation history</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View Donations</Button>
                </CardFooter>
              </Card>
            </Link>
            
            <Link href="/inventory" className="block h-full">
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle>Blood Inventory</CardTitle>
                  <CardDescription>Monitor blood supply and expiry</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Track blood units and expiration dates</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Check Inventory</Button>
                </CardFooter>
              </Card>
            </Link>
            
            <Link href="/hospitals" className="block h-full">
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle>Hospitals</CardTitle>
                  <CardDescription>Manage partner hospitals</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>View and update hospital information</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View Hospitals</Button>
                </CardFooter>
              </Card>
            </Link>
            
            <Link href="/requests" className="block h-full">
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle>Blood Requests</CardTitle>
                  <CardDescription>Handle hospital blood requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>View and process incoming blood requests</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View Requests</Button>
                </CardFooter>
              </Card>
            </Link>
            
            <Link href="/reports" className="block h-full">
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle>Reports</CardTitle>
                  <CardDescription>Generate system reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>View statistics and generate reports</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View Reports</Button>
                </CardFooter>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
