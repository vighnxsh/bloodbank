"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Calendar as CalendarIcon, User, Phone, Mail, BadgeAlert, DropletIcon, ArrowLeft, Loader2 } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

const donorFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  age: z.coerce.number().min(18, {
    message: "Donor must be at least 18 years old.",
  }).max(65, {
    message: "Donor must be under 65 years old.",
  }),
  bloodType: z.enum(bloodTypes as [string, ...string[]]),
  contact: z.string().min(10, {
    message: "Contact number must be at least 10 characters.",
  }),
  email: z.string().email({ message: "Invalid email address." }).optional().nullable(),
  lastDonated: z.date().optional().nullable(),
})

type DonorFormValues = z.infer<typeof donorFormSchema>

interface DonorData {
  id?: number;
  name: string;
  age: number;
  bloodType: string;
  contact: string;
  email: string | null;
  lastDonated: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface DonorFormProps {
  initialData?: DonorData;
}

export default function DonorForm({ initialData }: DonorFormProps = {}) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!initialData
  
  const defaultValues: Partial<DonorFormValues> = {
    name: "",
    age: 18,
    bloodType: "O+",
    contact: "",
    email: "",
    lastDonated: null,
    ...initialData,
  }
  
  const form = useForm<DonorFormValues>({
    resolver: zodResolver(donorFormSchema),
    defaultValues,
  })
  
  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
  
  async function onSubmit(data: DonorFormValues) {
    setIsSubmitting(true)
    
    try {
      const url = isEditing 
        ? `/api/donors/${initialData.id}` 
        : "/api/donors"
      
      const method = isEditing ? "PATCH" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? "update" : "create"} donor`)
      }
      
      toast({
        title: "Success",
        description: `Donor ${isEditing ? "updated" : "created"} successfully`,
      })
      
      router.push("/donors")
      router.refresh()
    } catch (error) {
      console.error(`Error ${isEditing ? "updating" : "creating"} donor:`, error)
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} donor. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none md:border md:shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              asChild
            >
              <Link href="/donors">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <CardTitle>{isEditing ? "Edit Donor" : "New Donor"}</CardTitle>
          </div>
          <CardDescription>
            {isEditing 
              ? "Update the donor&apos;s information in the system." 
              : "Add a new blood donor to the system."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Left column - Avatar and blood type */}
                <div className="w-full md:w-64 flex flex-col items-center gap-6">
                  <div className="flex flex-col items-center gap-3">
                    <Avatar className="h-32 w-32 border-2 border-primary/10">
                      <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                        {getInitials(form.watch("name") || initialData?.name || "")}
                      </AvatarFallback>
                    </Avatar>
                    
                    <FormField
                      control={form.control}
                      name="bloodType"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <div className="flex items-center gap-2">
                                  <DropletIcon className="h-4 w-4 text-primary" />
                                  <span>Blood Type:</span>
                                  {field.value && (
                                    <Badge className="ml-1 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary">
                                      {field.value}
                                    </Badge>
                                  )}
                                </div>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {bloodTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  <div className="flex items-center gap-2">
                                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                                      {type}
                                    </Badge>
                                    <span className="text-sm">{type}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="w-full p-4 rounded-lg border bg-muted/40">
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                      <BadgeAlert className="h-4 w-4 text-muted-foreground" />
                      Eligibility Criteria
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                      <li>Must be between 18-65 years old</li>
                      <li>Minimum weight of 45kg</li>
                      <li>No recent tattoos (last 6 months)</li>
                      <li>No recent infections or illnesses</li>
                      <li>Hemoglobin level of at least 12.5g/dL</li>
                    </ul>
                  </div>
                </div>
                
                {/* Right column - form fields */}
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-8" placeholder="Enter full name" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input type="number" min={18} max={65} {...field} />
                          </FormControl>
                          <FormDescription>
                            Donor must be between 18 and 65 years old.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-8" placeholder="Enter contact number" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email (Optional)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input 
                                className="pl-8"
                                type="email" 
                                placeholder="Enter email address" 
                                {...field} 
                                value={field.value || ""} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastDonated"
                      render={({ field }) => (
                        <FormItem className="flex flex-col col-span-2">
                          <FormLabel>Last Donated</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={`w-full pl-3 text-left font-normal flex justify-between items-center ${
                                    !field.value ? "text-muted-foreground" : ""
                                  }`}
                                >
                                  {field.value ? (
                                    <span>{format(field.value, "PPP")}</span>
                                  ) : (
                                    <span>Never donated</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value || undefined}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            Date of last donation, if applicable.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-4 pt-4">
                <Button
                  variant="outline"
                  type="button"
                  disabled={isSubmitting}
                  asChild
                >
                  <Link href="/donors">
                    Cancel
                  </Link>
                </Button>
                <Button type="submit" disabled={isSubmitting} className="min-w-24">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditing ? "Updating..." : "Saving..."}
                    </>
                  ) : (
                    isEditing ? "Update Donor" : "Add Donor"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
} 