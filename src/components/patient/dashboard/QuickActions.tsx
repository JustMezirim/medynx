import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Stethoscope, Calendar, FileText, User } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b">
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-green-600" />
          <span>Quick Actions</span>
        </CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          <Link href="/dashboard/patient/doctors">
            <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 h-12">
              <Stethoscope className="h-5 w-5 mr-3" />
              Find Doctor
            </Button>
          </Link>

          <Link href="/dashboard/patient/appointments">
            <Button variant="outline" className="w-full justify-start hover:bg-gray-50 h-12">
              <Calendar className="h-5 w-5 mr-3" />
              My Appointments
            </Button>
          </Link>

          <Link href="/dashboard/patient/medical-files">
            <Button variant="outline" className="w-full justify-start hover:bg-gray-50 h-12">
              <FileText className="h-5 w-5 mr-3" />
              Medical Files
            </Button>
          </Link>

          <Link href="/dashboard/patient/profile">
            <Button variant="outline" className="w-full justify-start hover:bg-gray-50 h-12">
              <User className="h-5 w-5 mr-3" />
              Update Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}