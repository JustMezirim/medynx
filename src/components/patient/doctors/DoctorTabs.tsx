import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Languages, Video } from "lucide-react"

interface Doctor {
  firstName: string
  bio: string
  languages?: string[]
}

interface Review {
  _id: string
  patientName: string
  rating: number
  comment: string
  date: string
}

interface DoctorTabsProps {
  doctor: Doctor
  reviews: Review[]
}

export function DoctorTabs({ doctor, reviews }: DoctorTabsProps) {
  return (
    <Tabs defaultValue="about" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>

      <TabsContent value="about" className="space-y-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>About Dr. {doctor.firstName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 leading-relaxed">{doctor.bio}</p>
            
            {doctor.languages && doctor.languages.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 flex items-center space-x-2">
                  <Languages className="h-4 w-4" />
                  <span>Languages</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {doctor.languages.map((lang, index) => (
                    <Badge key={index} variant="outline">{lang}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="services" className="space-y-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Services & Specializations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
              <Video className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-medium">Video Consultations</p>
                <p className="text-sm text-gray-600">Secure online consultations with Zoom integration</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="reviews" className="space-y-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Patient Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium">{review.patientName}</span>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No reviews yet</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}