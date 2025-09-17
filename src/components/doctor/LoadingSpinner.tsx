import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"

interface LoadingSpinnerProps {
  title?: string
  subtitle?: string
  message?: string
}

export function LoadingSpinner({ 
  title = "Loading", 
  subtitle = "Please wait...", 
  message = "Loading data..." 
}: LoadingSpinnerProps) {
  return (
    <div className="flex h-screen">
      <Sidebar userRole="doctor" userName="Doctor" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader  />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">{message}</p>
          </div>
        </main>
      </div>
    </div>
  )
}