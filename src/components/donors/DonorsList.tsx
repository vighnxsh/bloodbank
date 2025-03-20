"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface Donor {
  id: number
  name: string
  age: number
  bloodType: string
  contact: string
  email: string | null
  lastDonated: string | null
  createdAt: string
}

export default function DonorsList() {
  const [donors, setDonors] = useState<Donor[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await fetch("/api/donors")
        
        if (!response.ok) {
          throw new Error("Failed to fetch donors")
        }
        
        const data = await response.json()
        setDonors(data)
      } catch (error) {
        console.error("Error fetching donors:", error)
        toast({
          title: "Error",
          description: "Failed to load donors. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchDonors()
  }, [toast])
  
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this donor?")) {
      return
    }
    
    try {
      const response = await fetch(`/api/donors/${id}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        throw new Error("Failed to delete donor")
      }
      
      setDonors(donors.filter(donor => donor.id !== id))
      
      toast({
        title: "Success",
        description: "Donor deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting donor:", error)
      toast({
        title: "Error",
        description: "Failed to delete donor. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  if (loading) {
    return <div className="flex justify-center p-8">Loading donors...</div>
  }
  
  if (donors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="mb-4">No donors found</p>
        <Link href="/donors/new">
          <Button>Add Your First Donor</Button>
        </Link>
      </div>
    )
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Blood Type</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Last Donated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donors.map((donor) => (
            <TableRow key={donor.id}>
              <TableCell className="font-medium">{donor.name}</TableCell>
              <TableCell>{donor.age}</TableCell>
              <TableCell>{donor.bloodType}</TableCell>
              <TableCell>{donor.contact}</TableCell>
              <TableCell>
                {donor.lastDonated 
                  ? format(new Date(donor.lastDonated), "PPP") 
                  : "Never"}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Link href={`/donors/${donor.id}`}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
                <Link href={`/donors/${donor.id}/edit`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(donor.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 