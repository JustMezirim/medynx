import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Star } from "lucide-react"
import Image from "next/image"

interface Appointment {
  _id: string
  doctor: {
    firstName: string
    lastName: string
    specialization: string
  }
  date: string
  timeSlot: string
  status: string
  symptoms?: string
  diagnosis?: string
  prescription?: string
}

interface PastAppointmentCardProps {
  appointment: Appointment
  rating: number
  reviewText: string
  onRatingChange: (rating: number) => void
  onReviewChange: (text: string) => void
  onSubmitReview: () => void
}

export function PastAppointmentCard({ 
  appointment, 
  rating, 
  reviewText, 
  onRatingChange, 
  onReviewChange, 
  onSubmitReview 
}: PastAppointmentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "completed": return "bg-blue-100 text-blue-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="border-0 shadow-lg aspect-square">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Image
              src={`/placeholder.svg?height=48&width=48&query=doctor`}
              alt="Doctor"
              width={48}
              height={48}
              className="rounded-full grayscale"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sm text-gray-900">
              Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
            </h3>
            <p className="text-xs text-gray-600 capitalize">{appointment.doctor.specialization}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <Badge className={`${getStatusColor(appointment.status)} px-2 py-1 text-xs`}>
            {appointment.status}
          </Badge>
          <div className="text-xs text-gray-500">
            {new Date(appointment.date).toLocaleDateString()}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-end space-y-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Show Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Medical Report</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="text-center pb-4 border-b">
                  <h3 className="font-semibold">Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}</h3>
                  <p className="text-sm text-gray-600">{appointment.doctor.specialization}</p>
                  <p className="text-sm text-gray-500">{new Date(appointment.date).toLocaleDateString()} at {appointment.timeSlot}</p>
                </div>
                {!appointment.symptoms && !appointment.diagnosis && !appointment.prescription ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No report available</p>
                    <p className="text-sm text-gray-500">The doctor hasn&apos;t provided a detailed report yet</p>
                  </div>
                ) : (
                  <>
                    {appointment.symptoms && (
                      <div>
                        <h4 className='font-semibold text-sm mb-2'>Symptoms</h4>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{appointment.symptoms}</p>
                      </div>
                    )}
                    {appointment.diagnosis && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Diagnosis</h4>
                        <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded">{appointment.diagnosis}</p>
                      </div>
                    )}
                    {appointment.prescription && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Prescription</h4>
                        <p className="text-sm text-gray-700 bg-green-50 p-3 rounded">{appointment.prescription}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                <Star className="h-4 w-4 mr-2" />
                Rate Doctor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rate Your Experience</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Rating</label>
                  <div className="flex space-x-1 mt-2">
                    {[1,2,3,4,5].map((star) => (
                      <Star
                        key={star}
                        className={`h-6 w-6 cursor-pointer ${
                          star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                        onClick={() => onRatingChange(star)}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Review</label>
                  <Textarea
                    placeholder="Share your experience..."
                    value={reviewText}
                    onChange={(e) => onReviewChange(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <Button onClick={onSubmitReview} className="w-full">
                  Submit Review
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}