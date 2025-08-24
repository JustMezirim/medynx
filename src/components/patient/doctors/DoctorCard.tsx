import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Users, Award, Video, MapPin, Calendar, Bookmark, BookmarkPlus } from "lucide-react"
import Link from "next/link"
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
  totalPatients?: number
  nextAvailable?: string
  workingHours?: {
    [key: string]: { start: string; end: string }
  }
}

interface DoctorCardProps {
  doctor: Doctor
  viewMode: "grid" | "list"
  isFavorite: boolean
  onToggleFavorite: (doctorId: string) => void
}

export function DoctorCard({ doctor, viewMode, isFavorite, onToggleFavorite }: DoctorCardProps) {
  return (
    <Card className={`hover:shadow-xl transition-all duration-300 border-0 shadow-lg group ${viewMode === "list" ? "flex-row" : ""}`}>
      <CardContent className={`p-6 ${viewMode === "list" ? "flex items-center space-x-6" : ""}`}>
        <div className={`${viewMode === "list" ? "flex items-center space-x-4" : "flex items-center space-x-4 mb-4"}`}>
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <Image
                src={`/placeholder.svg?height=64&width=64&query=doctor ${doctor.firstName}`}
                alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                width={64}
                height={64}
                className="rounded-full"
              />
            </div>
            {doctor.isVerified && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <Award className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-lg text-gray-900">
                  Dr. {doctor.firstName} {doctor.lastName}
                </h3>
                {doctor.isVerified && (
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    Verified
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleFavorite(doctor._id)}
                className="h-8 w-8 p-0 hover:bg-red-50"
              >
                {isFavorite ? (
                  <Bookmark className="h-4 w-4 text-red-500 fill-red-500" />
                ) : (
                  <BookmarkPlus className="h-4 w-4 text-gray-400 hover:text-red-500" />
                )}
              </Button>
            </div>
            <p className="text-blue-600 font-medium capitalize mb-1">{doctor.specialization}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{doctor.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{doctor.experience} years exp.</span>
              </div>
              {doctor.totalPatients && (
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{doctor.totalPatients}+ patients</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={viewMode === "list" ? "flex-1 space-y-3" : "space-y-4"}>
          <p className="text-sm text-gray-600 line-clamp-2">{doctor.bio}</p>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-green-600">₦{doctor.consultationFee}</span>
                <span className="text-sm text-gray-500">per session</span>
              </div>
              {doctor.nextAvailable && (
                <div className="flex items-center space-x-1 text-xs text-green-600">
                  <Clock className="h-3 w-3" />
                  <span>Next: {doctor.nextAvailable}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <Badge variant="outline" className="text-xs">
              <Video className="h-3 w-3 mr-1" />
              Video
            </Badge>
            <Badge variant="outline" className="text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              In-person
            </Badge>
          </div>

          {doctor.workingHours && Object.values(doctor.workingHours).some(hours => hours.start !== "Closed") ? (
            <Link href={`/dashboard/patient/doctors/${doctor._id}`} className="block">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 group-hover:bg-blue-700 transition-colors">
                <Calendar className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
            </Link>
          ) : (
            <Button disabled className="w-full bg-gray-400 cursor-not-allowed">
              <Calendar className="h-4 w-4 mr-2" />
              Not Available
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}