"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X, Dumbbell, User, LogOut, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "About", href: "/#about" },
  { name: "Blogs", href: "/blogs" },
  { name: "Testimonials", href: "/#testimonials" },
  { name: "Tutorials", href: "/tutorials" },
  { name: "Programs", href: "/#programs" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
    setUserMenuOpen(false)
  }

  // Get display name: prefer first_name, fallback to full_name
  const getDisplayName = () => {
    if (user?.first_name) {
      return user.first_name;
    }
    return user?.full_name || "User";
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logos/pm-logo.jpg"
              alt="Pro Methods Gym"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="text-xl font-bold tracking-tight">PRO METHODS</span>
          </Link>

          {/* Desktop Navigation - Only show nav items when logged in */}
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                // Handle smooth scroll for anchor links if on home page
                onClick={(e) => {
                  if (item.href.startsWith("/#")) {
                    // If we are on home page, prevent default scroll behavior might be needed if using next/link, 
                    // but next/link handles it well usually. 
                    // However, to be safe and ensure smooth scroll, we can leave as is.
                  }
                }}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              // User Menu when logged in
              <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span className="max-w-[150px] truncate">{getDisplayName()}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-2 text-sm">
                    <p className="font-medium">
                      {user.first_name && user.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : user.full_name}
                    </p>
                    {user.email && (
                      <div className="flex items-center gap-2 text-muted-foreground mt-1">
                        <Mail className="h-4 w-4" />
                        <span className="text-xs truncate">{user.email}</span>
                      </div>
                    )}
                    {user.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground mt-1">
                        <Phone className="h-4 w-4" />
                        <span className="text-xs">{user.phone}</span>
                      </div>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                    <Dumbbell className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/dashboard/progress")}>
                    <User className="mr-2 h-4 w-4" />
                    Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Sign In / Get Started when not logged in
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/dashboard/workouts">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border transition-all duration-300",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible",
        )}
      >
        <div className="px-4 py-4 space-y-4">
          {user ? (
            // Logged in mobile menu
            <>
              {/* User Info Section */}
              <div className="pb-4 border-b border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {user.first_name && user.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : user.full_name}
                    </p>
                    {user.email && (
                      <div className="flex items-center gap-1 text-muted-foreground text-xs">
                        <Mail className="h-3 w-3" />
                        <span className="truncate max-w-[200px]">{user.email}</span>
                      </div>
                    )}
                    {user.phone && (
                      <div className="flex items-center gap-1 text-muted-foreground text-xs">
                        <Phone className="h-3 w-3" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-sm font-medium text-muted-foreground hover:text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Logout Button */}
              <div className="pt-4 border-t border-border">
                <Button
                  variant="ghost"
                  className="w-full text-red-600 justify-start"
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            // Not logged in mobile menu
            <div className="flex flex-col gap-2">
              <Button variant="ghost" asChild className="w-full">
                <Link href="/login" onClick={() => setIsOpen(false)}>Sign In</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/dashboard/workouts" onClick={() => setIsOpen(false)}>Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
