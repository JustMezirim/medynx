import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Users, Award, GraduationCap, Calendar } from "lucide-react"
import Image from "next/image"

interface Doctor {
  _id: string
  firstName: string
  lastName: string
  specialization: string
  experience: number
  rating: number
  consultationFee: number
  bio: string
  isVerified: boolean
  education?: string
  totalPatients?: number
  totalReviews?: number
  nextAvailable?: string
  hasAvailability?: boolean
}

interface DoctorProfileProps {
  doctor: Doctor
  onBookAppointment: () => void
}

export function DoctorProfile({ doctor, onBookAppointment }: DoctorProfileProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <Image
                src={`/placeholder.svg?height=128&width=128&query=doctor ${doctor.firstName}`}
                alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                width={128}
                height={128}
                className="rounded-full"
              />
            </div>
            {doctor.isVerified && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Award className="h-5 w-5 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  Dr. {doctor.firstName} {doctor.lastName}
                </h1>
                {doctor.isVerified && (
                  <Badge className="bg-green-100 text-green-800">
                    Verified Doctor
                  </Badge>
                )}
              </div>
              <p className="text-xl text-blue-600 font-semibold capitalize mb-2">
                {doctor.specialization}
              </p>
              {doctor.education && (
                <p className="text-gray-600 flex items-center space-x-2">
                  <GraduationCap className="h-4 w-4" />
                  <span>{doctor.education}</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <div>
                  <p className="font-semibold">{doctor.rating.toFixed(1)}</p>
                  <p className="text-xs text-gray-500">{doctor.totalReviews || 0} reviews</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-semibold">{doctor.experience} years</p>
                  <p className="text-xs text-gray-500">Experience</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-semibold">{doctor.totalPatients || 0}+</p>
                  <p className="text-xs text-gray-500">Patients</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-green-600">₦{doctor.consultationFee}</span>
                <div>
                  <p className="text-xs text-gray-500">per session</p>
                </div>
              </div>
            </div>

            {doctor.nextAvailable && (
              <div className="flex items-center space-x-2 text-green-600">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">Next available: {doctor.nextAvailable}</span>
              </div>
            )}

            <div className="flex space-x-3">
              {doctor.hasAvailability ? (
                <Button 
                  onClick={onBookAppointment}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Book Appointment
                </Button>
              ) : (
                <Button 
                  disabled
                  className="bg-gray-400 cursor-not-allowed"
                  size="lg"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Not Available
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}