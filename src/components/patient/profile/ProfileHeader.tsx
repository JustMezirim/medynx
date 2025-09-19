import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Calendar, Phone, Mail } from "lucide-react"

interface ProfileHeaderProps {
  firstName?: string
  lastName?: string
}

export function ProfileHeader({ firstName, lastName }: ProfileHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Overview</CardTitle>
        <CardDescription>Your personal information summary</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-12 w-12 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold">
                {firstName || 'Unknown'} {lastName || 'User'}
              </h2>
              <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                <span>Patient</span>
              </div>
            </div>
            <p className="text-lg text-gray-600 mb-2">Healthcare Member</p>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Member since 2024</span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>Contact verified</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="h-4 w-4" />
                <span>Email verified</span>
              </div>
            </div>
          </div>
          <Button variant="outline">Change Photo</Button>
        </div>
      </CardContent>
    </Card>
  )
}