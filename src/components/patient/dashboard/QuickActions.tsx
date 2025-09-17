import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Stethoscope, Calendar, FileText, User } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Link href="/dashboard/patient/doctors">
            <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
              <Stethoscope className="h-4 w-4 mr-2" />
              Find Doctor
            </Button>
          </Link>

          <Link href="/dashboard/patient/appointments">
            <Button variant="outline" className="w-full justify-start border-slate-200">
              <Calendar className="h-4 w-4 mr-2" />
              My Appointments
            </Button>
          </Link>

          <Link href="/dashboard/patient/medical-files">
            <Button variant="outline" className="w-full justify-start border-slate-200">
              <FileText className="h-4 w-4 mr-2" />
              Medical Files
            </Button>
          </Link>

          <Link href="/dashboard/patient/profile">
            <Button variant="outline" className="w-full justify-start border-slate-200">
              <User className="h-4 w-4 mr-2" />
              Update Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}