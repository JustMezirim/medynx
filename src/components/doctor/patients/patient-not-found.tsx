import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import Link from "next/link"

export function PatientNotFound() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar userRole="doctor" userName="Doctor" />
      <div className="flex-1 flex flex-col">
        <DashboardHeader  />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Patient not found</h2>
            <Link href="/dashboard/doctor/patients">
              <Button>Back to Patients</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}