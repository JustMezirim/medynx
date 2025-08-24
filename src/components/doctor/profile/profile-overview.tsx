import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Award, Star, Stethoscope, DollarSign } from "lucide-react"

interface DoctorProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  specialization: string
  licenseNumber: string
  experience: number
  bio: string
  consultationFee: number
  rating: number
  isVerified: boolean
}

interface ProfileOverviewProps {
  profile: DoctorProfile | null
}

export function ProfileOverview({ profile }: ProfileOverviewProps) {
  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Overview</CardTitle>
          <CardDescription>Your professional summary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">Loading profile information...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Overview</CardTitle>
        <CardDescription>Your professional summary</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-12 w-12 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold">
                Dr. {profile.firstName || 'Unknown'} {profile.lastName || 'User'}
              </h2>
              {profile.isVerified && (
                <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                  <Award className="h-3 w-3" />
                  <span>Verified</span>
                </div>
              )}
            </div>
            <p className="text-lg text-gray-600 capitalize mb-2">{profile.specialization || 'Not specified'}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{(profile.rating || 0).toFixed(1)} rating</span>
              </div>
              <div className="flex items-center space-x-1">
                <Stethoscope className="h-4 w-4" />
                <span>{profile.experience || 0} years experience</span>
              </div>
              <div className="flex items-center space-x-1">
                <DollarSign className="h-4 w-4" />
                <span>₦{profile.consultationFee || 0} per consultation</span>
              </div>
            </div>
          </div>
          <Button variant="outline">Change Photo</Button>
        </div>
      </CardContent>
    </Card>
  )
}