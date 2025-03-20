import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata = {
  title: "Reports | Blood Donation Management",
  description: "Generate and view system reports",
}

export default function ReportsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Reports</h1>
        <div className="space-x-2">
          <Button>Export Data</Button>
        </div>
      </div>
      
      <Tabs defaultValue="summary" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Total Donors</CardTitle>
                <CardDescription>All registered donors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">0</div>
                <p className="text-xs text-muted-foreground mt-1">Coming soon: Actual donor count</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Total Donations</CardTitle>
                <CardDescription>All recorded donations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">0</div>
                <p className="text-xs text-muted-foreground mt-1">Coming soon: Actual donation count</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Available Units</CardTitle>
                <CardDescription>Current inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">0</div>
                <p className="text-xs text-muted-foreground mt-1">Coming soon: Actual inventory count</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
              <CardDescription>General statistics about the system</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-12 text-muted-foreground">
                Coming soon: Dashboard charts and statistics
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="donations">
          <Card>
            <CardHeader>
              <CardTitle>Donation Reports</CardTitle>
              <CardDescription>Detailed reports on blood donations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-12 text-muted-foreground">
                Coming soon: Donation statistics and trends
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Reports</CardTitle>
              <CardDescription>Detailed reports on blood inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-12 text-muted-foreground">
                Coming soon: Inventory statistics and expiry alerts
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 