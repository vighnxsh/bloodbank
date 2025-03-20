"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Calendar as CalendarIcon } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
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

interface DonorFormProps {
  initialData?: any
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
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
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
                name="bloodType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bloodTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      <Input placeholder="Enter contact number" {...field} />
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
                      <Input 
                        type="email" 
                        placeholder="Enter email address" 
                        {...field} 
                        value={field.value || ""} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastDonated"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Last Donated</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value ? "text-muted-foreground" : ""
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
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
            
            <div className="flex items-center justify-end space-x-4">
              <Link href="/donors">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : isEditing ? "Update Donor" : "Add Donor"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 