import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Camera, Shield, Heart } from "lucide-react"

interface ProfileHeaderProps {
  firstName?: string
  lastName?: string
}

export function ProfileHeader({ firstName, lastName }: ProfileHeaderProps) {
  return (
    <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
      <CardContent className="p-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          <div className="relative">
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <User className="h-16 w-16 text-white" />
            </div>
            <Button size="sm" className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-white text-blue-600 hover:bg-gray-100 p-0">
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold mb-2">{firstName} {lastName}</h1>
            <p className="text-blue-100 text-lg mb-4">Patient Profile</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <Badge className="bg-white/20 text-white border-white/30">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30">
                <Heart className="h-3 w-3 mr-1" />
                Active Patient
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}