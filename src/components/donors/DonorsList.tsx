"use client"

import { useState, useEffect } from "react"
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
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  DropletIcon, 
  Search, 
  Plus, 
  Eye, 
  Pencil, 
  Trash2, 
  Loader2 
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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

export default function DonorsList() {
  const [donors, setDonors] = useState<Donor[]>([])
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [deletingId, setDeletingId] = useState<number | null>(null)
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
        setFilteredDonors(data)
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
  
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDonors(donors)
    } else {
      const lowercasedQuery = searchQuery.toLowerCase()
      setFilteredDonors(
        donors.filter(
          donor => 
            donor.name.toLowerCase().includes(lowercasedQuery) ||
            donor.bloodType.toLowerCase().includes(lowercasedQuery) ||
            donor.contact.includes(searchQuery)
        )
      )
    }
  }, [searchQuery, donors])
  
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this donor? This action cannot be undone.")) {
      return
    }
    
    setDeletingId(id)
    
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
    } finally {
      setDeletingId(null)
    }
  }
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading donors...</p>
      </div>
    )
  }
  
  if (donors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center border rounded-lg bg-background/50">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
          <DropletIcon className="h-10 w-10 text-primary/60" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No donors found</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          You haven&apos;t added any donors yet. Start by adding your first donor to the system.
        </p>
        <Link href="/donors/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Your First Donor
          </Button>
        </Link>
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search donors..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filteredDonors.length}</span> of{" "}
          <span className="font-medium text-foreground">{donors.length}</span> donors
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Donor</TableHead>
              <TableHead>Blood Type</TableHead>
              <TableHead className="hidden md:table-cell">Age</TableHead>
              <TableHead className="hidden md:table-cell">Contact</TableHead>
              <TableHead className="hidden md:table-cell">Last Donated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDonors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No results found for &quot;{searchQuery}&quot;
                </TableCell>
              </TableRow>
            ) : (
              filteredDonors.map((donor) => (
                <TableRow key={donor.id} className="group">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="hidden sm:flex h-9 w-9 bg-primary/10 text-primary">
                        <AvatarFallback>{getInitials(donor.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{donor.name}</div>
                        <div className="text-xs text-muted-foreground md:hidden">
                          Age: {donor.age} • {donor.contact}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`${bloodTypeColors[donor.bloodType]} border-none`}
                    >
                      {donor.bloodType}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{donor.age}</TableCell>
                  <TableCell className="hidden md:table-cell">{donor.contact}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {donor.lastDonated 
                      ? (
                        <time dateTime={donor.lastDonated} className="text-muted-foreground">
                          {format(new Date(donor.lastDonated), "d MMM yyyy")}
                        </time>
                      ) 
                      : (
                        <span className="text-muted-foreground">Never</span>
                      )
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/donors/${donor.id}`}>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                      </Link>
                      <Link href={`/donors/${donor.id}/edit`}>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </Link>
                      <Button 
                        size="icon"
                        variant="ghost" 
                        className="h-8 w-8 text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                        disabled={deletingId === donor.id}
                        onClick={() => handleDelete(donor.id)}
                      >
                        {deletingId === donor.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 