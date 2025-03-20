"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Menu, 
  DropletIcon, 
  Activity, 
  FileBox, 
  Building2, 
  FileQuestion, 
  BarChart,
  AlignRight,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  {
    name: "Donors",
    href: "/donors",
    icon: <DropletIcon className="h-4 w-4 mr-2" />
  },
  {
    name: "Donations",
    href: "/donations",
    icon: <Activity className="h-4 w-4 mr-2" />
  },
  {
    name: "Inventory",
    href: "/inventory",
    icon: <FileBox className="h-4 w-4 mr-2" />
  },
  {
    name: "Hospitals",
    href: "/hospitals",
    icon: <Building2 className="h-4 w-4 mr-2" />
  },
  {
    name: "Requests",
    href: "/requests",
    icon: <FileQuestion className="h-4 w-4 mr-2" />
  },
  {
    name: "Reports",
    href: "/reports",
    icon: <BarChart className="h-4 w-4 mr-2" />
  }
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="bg-background sticky top-0 z-40 border-b shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <DropletIcon className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            BloodBridge
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className={cn(
                "text-sm font-medium flex items-center transition-colors hover:text-primary",
                pathname === item.href || pathname.startsWith(`${item.href}/`) 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <AlignRight className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b">
          <div className="container py-4 px-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-2 py-1 text-sm font-medium",
                    pathname === item.href || pathname.startsWith(`${item.href}/`)
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
} 