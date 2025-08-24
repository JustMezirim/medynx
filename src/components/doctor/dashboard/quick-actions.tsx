import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, Users, Settings } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Link href="/dashboard/doctor/availability">
            <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
              <Clock className="h-4 w-4 mr-2" />
              Set Availability
            </Button>
          </Link>
          <Link href="/dashboard/doctor/appointments">
            <Button variant="outline" className="w-full justify-start border-slate-200">
              <Calendar className="h-4 w-4 mr-2" />
              View Appointments
            </Button>
          </Link>
          <Link href="/dashboard/doctor/patients">
            <Button variant="outline" className="w-full justify-start border-slate-200">
              <Users className="h-4 w-4 mr-2" />
              Patient Records
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}