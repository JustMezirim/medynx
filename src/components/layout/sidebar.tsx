// Simplified Sidebar Component
"use client"

import { useState, useEffect, useCallback } from "react"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar, Users, FileText, Settings, LogOut, Stethoscope, User, BarChart3, Clock, Menu, X } from "lucide-react"
import { showToast } from "@/components/ui/toast-helper"


interface SidebarProps {
  userRole: "patient" | "doctor" | "admin"
  userName: string
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const checkAccountStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.status === 403) {
        showToast.error('Account Deactivated', 'Your account has been deactivated')
        document.cookie = 'token=; Max-Age=0; path=/'
        router.push('/login')
        return false
      }
      if (response.ok) {
        const data = await response.json()
        if (!data.user.isActive) {
          showToast.error('Account Deactivated', 'Your account has been deactivated')
          document.cookie = 'token=; Max-Age=0; path=/'
          router.push('/login')
          return false
        }
      }
      return true
    } catch {
      return true
    }
  }, [router])

  const handleNavClick = async (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    const isActive = await checkAccountStatus()
    if (isActive) {
      router.push(href)
      setIsMobileMenuOpen(false)
    }
  }

  useEffect(() => {
    checkAccountStatus()
  }, [pathname, checkAccountStatus])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      showToast.success("Logged out successfully")
      router.push("/login")
    } catch {
      showToast.error("Logout failed")
    } finally {
      setIsLoggingOut(false)
    }
  }

  const getNavigationItems = () => {
    const baseItems = [
      {
        href: `/dashboard/${userRole}`,
        label: "Dashboard",
        icon: BarChart3,
      },
    ]

    switch (userRole) {
      case "patient":
        return [
          ...baseItems,
          {
            href: `/dashboard/${userRole}/doctors`,
            label: "Find Doctors",
            icon: Stethoscope,
          },
          {
            href: `/dashboard/${userRole}/appointments`,
            label: "My Appointments",
            icon: Calendar,
          },
          {
            href: `/dashboard/${userRole}/medical-files`,
            label: "Medical Files",
            icon: FileText,
          },
          {
            href: `/dashboard/${userRole}/profile`,
            label: "Profile",
            icon: User,
          },
        ]

      case "doctor":
        return [
          ...baseItems,
          {
            href: `/dashboard/${userRole}/appointments`,
            label: "Appointments",
            icon: Calendar,
          },
          {
            href: `/dashboard/${userRole}/availability`,
            label: "Availability",
            icon: Clock,
          },
          {
            href: `/dashboard/${userRole}/patients`,
            label: "Patients",
            icon: Users,
          },
          {
            href: `/dashboard/${userRole}/medical-files`,
            label: "Medical Files",
            icon: FileText,
          },
          {
            href: `/dashboard/${userRole}/profile`,
            label: "Profile",
            icon: User,
          },
        ]

      case "admin":
        return [
          ...baseItems,
          {
            href: `/dashboard/${userRole}/doctors`,
            label: "Manage Doctors",
            icon: Stethoscope,
          },
          {
            href: `/dashboard/${userRole}/patients`,
            label: "Manage Patients",
            icon: Users,
          },
          {
            href: `/dashboard/${userRole}/appointments`,
            label: "All Appointments",
            icon: Calendar,
          },
          {
            href: `/dashboard/${userRole}/payments`,
            label: "Payments",
            icon: BarChart3,
          },
          // {
          //   href: `/dashboard/${userRole}/permissions`,
          //   label: "User Permissions",
          //   icon: Settings,
          // },
          {
            href: `/dashboard/${userRole}/settings`,
            label: "Settings",
            icon: Settings,
          },
        ]

      default:
        return baseItems
    }
  }

  const navigationItems = getNavigationItems()

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden bg-white/90 backdrop-blur-sm shadow-lg border border-slate-200 hover:bg-white"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex h-screen flex-col bg-slate-50/50 backdrop-blur-xl border-r border-slate-200/60 shadow-lg
      `}>
        {/* Logo */}
        <div className="flex items-center space-x-3 px-6 h-16 bg-white/80 backdrop-blur-sm border-b border-slate-200/60">
          {/* <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <Heart className="h-5 w-5 text-white" />
          </div> */}
          <div>
            <span className="text-lg font-bold text-slate-900">Medynx</span>
            <p className="text-xs text-slate-500 capitalize">{userRole}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <a
                key={item.href}
                href={item.href}
                className={`group flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-slate-600 hover:bg-white/70 hover:text-slate-900 hover:shadow-sm"
                }`}
                onClick={(e) => handleNavClick(e, item.href)}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-white/20" 
                    : "bg-slate-100 group-hover:bg-slate-200"
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="font-medium text-sm">{item.label}</span>
              </a>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 bg-white/50 backdrop-blur-sm border-t border-slate-200/60">
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-600 hover:text-white hover:bg-red-500 rounded-xl py-2.5 transition-all duration-200"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors mr-3">
              <LogOut className="h-4 w-4" />
            </div>
            <span className="font-medium text-sm">
              {isLoggingOut ? "Logging out..." : "Logout"}
            </span>
          </Button>
        </div>
      </div>
    </>
  )
}