import Link from "next/link"
import { 
  DropletIcon, 
  Activity, 
  FileBox, 
  Building2, 
  FileQuestion, 
  BarChart, 
  Users, 
  HeartPulse 
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const stats = [
  { label: "Registered Donors", value: "500+", icon: <Users className="h-4 w-4" /> },
  { label: "Monthly Donations", value: "120+", icon: <HeartPulse className="h-4 w-4" /> },
  { label: "Blood Units Saved", value: "1,500+", icon: <DropletIcon className="h-4 w-4" /> },
  { label: "Partner Hospitals", value: "25+", icon: <Building2 className="h-4 w-4" /> },
]

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary/60">
        <div className="absolute inset-0 bg-grid-white/10" />
        
        <div className="container relative z-20 px-4 pt-20 pb-24 md:pt-32 md:pb-40">
          <div className="max-w-2xl space-y-6">
            <div className="inline-block rounded-lg bg-primary/10 backdrop-blur-sm px-3 py-1 text-sm text-white mb-4">
              Saving Lives Together
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
              Blood Donation Management System
            </h1>
            <p className="text-lg text-white/80 md:text-xl max-w-[600px]">
              A comprehensive platform for managing blood donations, inventory, 
              and hospital requests — helping to save lives, one donation at a time.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/donors/new">
                <Button size="lg" className="rounded-full">
                  Register As Donor
                </Button>
              </Link>
              <Link href="/donors">
                <Button size="lg" variant="outline" className="rounded-full bg-white/10 hover:bg-white/20 text-white border-white/20">
                  View Donors
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="bg-background border-y border-border/40">
        <div className="container py-12 px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center justify-center text-center p-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Dashboard Section */}
      <section className="w-full py-12 md:py-16 lg:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-[850px] mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Dashboard Overview</h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Efficiently manage all aspects of the blood donation process through our comprehensive system
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/donors" className="block group relative h-full">
              <Card className="h-full overflow-hidden transition-all duration-200 group-hover:shadow-lg border-primary/10 group-hover:border-primary/30">
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropletIcon className="h-5 w-5 text-primary/80" />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DropletIcon className="h-5 w-5 text-primary" />
                    Donors
                  </CardTitle>
                  <CardDescription>Manage blood donors information</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Register new donors and view donor history</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full group-hover:bg-primary/10 group-hover:text-primary">
                    View Donors
                  </Button>
                </CardFooter>
              </Card>
            </Link>
            
            <Link href="/donations" className="block group relative h-full">
              <Card className="h-full overflow-hidden transition-all duration-200 group-hover:shadow-lg border-primary/10 group-hover:border-primary/30">
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Activity className="h-5 w-5 text-primary/80" />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Donations
                  </CardTitle>
                  <CardDescription>Track blood donation records</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Record and view donation history</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full group-hover:bg-primary/10 group-hover:text-primary">
                    View Donations
                  </Button>
                </CardFooter>
              </Card>
            </Link>
            
            <Link href="/inventory" className="block group relative h-full">
              <Card className="h-full overflow-hidden transition-all duration-200 group-hover:shadow-lg border-primary/10 group-hover:border-primary/30">
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <FileBox className="h-5 w-5 text-primary/80" />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileBox className="h-5 w-5 text-primary" />
                    Blood Inventory
                  </CardTitle>
                  <CardDescription>Monitor blood supply and expiry</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Track blood units and expiration dates</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full group-hover:bg-primary/10 group-hover:text-primary">
                    Check Inventory
                  </Button>
                </CardFooter>
              </Card>
            </Link>
            
            <Link href="/hospitals" className="block group relative h-full">
              <Card className="h-full overflow-hidden transition-all duration-200 group-hover:shadow-lg border-primary/10 group-hover:border-primary/30">
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Building2 className="h-5 w-5 text-primary/80" />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Hospitals
                  </CardTitle>
                  <CardDescription>Manage partner hospitals</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>View and update hospital information</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full group-hover:bg-primary/10 group-hover:text-primary">
                    View Hospitals
                  </Button>
                </CardFooter>
              </Card>
            </Link>
            
            <Link href="/requests" className="block group relative h-full">
              <Card className="h-full overflow-hidden transition-all duration-200 group-hover:shadow-lg border-primary/10 group-hover:border-primary/30">
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <FileQuestion className="h-5 w-5 text-primary/80" />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileQuestion className="h-5 w-5 text-primary" />
                    Blood Requests
                  </CardTitle>
                  <CardDescription>Handle hospital blood requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>View and process incoming blood requests</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full group-hover:bg-primary/10 group-hover:text-primary">
                    View Requests
                  </Button>
                </CardFooter>
              </Card>
            </Link>
            
            <Link href="/reports" className="block group relative h-full">
              <Card className="h-full overflow-hidden transition-all duration-200 group-hover:shadow-lg border-primary/10 group-hover:border-primary/30">
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <BarChart className="h-5 w-5 text-primary/80" />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-primary" />
                    Reports
                  </CardTitle>
                  <CardDescription>Generate system reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>View statistics and generate reports</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full group-hover:bg-primary/10 group-hover:text-primary">
                    View Reports
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary/5 border-y">
        <div className="container px-4 py-16 md:py-24">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h2 className="text-3xl font-bold">Ready to save lives?</h2>
            <p className="text-muted-foreground">
              Join our blood donation management system today and contribute to the noble cause of saving lives.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/donors/new">
                <Button>Register as Donor</Button>
              </Link>
              <Link href="/requests/new">
                <Button variant="outline">Request Blood</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
