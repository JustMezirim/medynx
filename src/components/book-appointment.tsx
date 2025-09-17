"use client"

import { useState, useEffect, useCallback } from "react"
import { formatDateForStorage } from "@/lib/date-utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

import { Calendar, Clock, User, Video, DollarSign, CheckCircle2, AlertCircle, Stethoscope } from "lucide-react"
import { showToast } from "@/components/ui/toast-helper"

interface Doctor {
  _id: string
  firstName: string
  lastName: string
  specialization: string
  consultationFee: number
  rating: number
  experience: number
}

interface TimeSlot {
  time: string
  isAvailable: boolean
}

interface DayAvailability {
  date: string
  slots: TimeSlot[]
}

interface BookAppointmentProps {
  doctorId?: string
}

export function BookAppointment({ doctorId }: BookAppointmentProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const selectedType = "video"
  const [symptoms, setSymptoms] = useState("")
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [availability, setAvailability] = useState<Record<string, DayAvailability>>({})
  const [loading, setLoading] = useState(false)
  const [bookingStep, setBookingStep] = useState<"select" | "details" | "confirm">("select")

  const fetchDoctorInfo = useCallback(async () => {
    try {
      const response = await fetch(`/api/doctor/${doctorId}`)
      if (response.ok) {
        const data = await response.json()
        setDoctor(data.doctor)
      }
    } catch (error) {
      console.error("Error fetching doctor info:", error)
    }
  }, [doctorId])

  const fetchAvailability = useCallback(async () => {
    try {
      // Fetch all availability for this doctor at once
      const response = await fetch(`/api/availability/doctor?doctorId=${doctorId}`)
      if (response.ok) {
        const data = await response.json()
        const availabilityMap: Record<string, DayAvailability> = {}
        
        if (data.availabilities) {
          data.availabilities.forEach((avail: { date: string; timeSlots: { time: string; isBooked: boolean }[] }) => {
            const dateKey = formatDateForStorage(avail.date)
            availabilityMap[dateKey] = {
              date: dateKey,
              slots: avail.timeSlots.map((slot: { time: string; isBooked: boolean }) => ({
                time: slot.time,
                isAvailable: !slot.isBooked
              }))
            }
          })
        }
        
        console.log('Fetched availability:', availabilityMap)
        setAvailability(availabilityMap)
      }
    } catch (error) {
      console.error('Error fetching availability:', error)
    }
  }, [doctorId])

  useEffect(() => {
    if (doctorId) {
      fetchDoctorInfo()
      fetchAvailability()
    }
  }, [doctorId, fetchDoctorInfo, fetchAvailability])

  const getAvailableSlots = () => {
    if (!selectedDate) return []
    const dateKey = formatDateForStorage(selectedDate)
    const dayAvailability = availability[dateKey]
    
    if (!dayAvailability) return []
    
    const now = new Date()
    const isToday = selectedDate.toDateString() === now.toDateString()
    
    let availableSlots = dayAvailability.slots.filter(slot => slot.isAvailable)
    
    // Filter out past times if it's today
    if (isToday) {
      availableSlots = availableSlots.filter(slot => {
        const [time, period] = slot.time.split(' ')
        const [hours, minutes] = time.split(':')
        let hour24 = parseInt(hours)
        
        if (period === 'PM' && hour24 !== 12) hour24 += 12
        if (period === 'AM' && hour24 === 12) hour24 = 0
        
        const slotTime = new Date()
        slotTime.setHours(hour24, parseInt(minutes), 0, 0)
        
        return slotTime > now
      })
    }
    
    return availableSlots
  }

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime || !doctor) return

    setLoading(true)
    try {
      const response = await fetch('/api/appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          doctorId: doctor._id,
          date: formatDateForStorage(selectedDate),
          timeSlot: selectedTime,
          type: selectedType,
          symptoms: symptoms.trim() || undefined
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Initiate payment
        const paymentResponse = await fetch('/api/payments/initiate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            appointmentId: data.appointment._id
          })
        })

        if (paymentResponse.ok) {
          const paymentData = await paymentResponse.json()
          // Redirect to payment gateway
          window.location.href = paymentData.authorizationUrl
        } else {
          const paymentError = await paymentResponse.json()
          showToast.error(paymentError.message || 'Payment initialization failed')
        }
      } else {
        const error = await response.json()
        showToast.error(error.message || "Failed to book appointment")
      }
    } catch (error) {
      console.error("Error booking appointment:", error)
      showToast.error("Failed to book appointment")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getAvailableDates = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    console.log('Today:', today.toDateString())
    console.log('Availability keys:', Object.keys(availability))
    
    const todayString = formatDateForStorage(today)
    
    const availableDates = Object.keys(availability).filter(dateKey => {
      const dayAvailability = availability[dateKey]
      const hasSlots = dayAvailability.slots.some(slot => slot.isAvailable)
      
      return dateKey >= todayString && hasSlots
    }).map(dateKey => {
      const [year, month, day] = dateKey.split('-').map(Number)
      return new Date(year, month - 1, day)
    })
    
    console.log('Available dates:', availableDates)
    return availableDates
  }

  const hasAnyAvailability = () => {
    return Object.keys(availability).length > 0 && getAvailableDates().length > 0
  }

  const renderCalendar = () => {
    const today = new Date()
    const currentMonth = selectedDate || today
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)

    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const availableDates = getAvailableDates()

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      
      const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
      const isToday = date.toDateString() === today.toDateString()
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()
      const isAvailable = availableDates.some(d => {
        const availableDate = d.toDateString()
        const currentDate = date.toDateString()
        return availableDate === currentDate
      })
      
      if (isAvailable) {
        console.log('Available date found:', date.toDateString())
      }
      const isPast = date < today && !isToday

      days.push(
        <button
          key={i}
          onClick={() => isAvailable && !isPast && setSelectedDate(date)}
          disabled={!isAvailable || isPast}
          className={`
            h-12 w-12 rounded-lg text-sm font-medium transition-all duration-200
            ${isSelected 
              ? 'bg-blue-600 text-white shadow-lg scale-105' 
              : isAvailable && !isPast
                ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                : isPast
                  ? 'text-slate-300 cursor-not-allowed'
                  : isCurrentMonth
                    ? 'text-slate-400 cursor-not-allowed hover:bg-slate-50'
                    : 'text-slate-300 cursor-not-allowed'
            }
            ${isToday && !isSelected ? 'ring-2 ring-blue-300' : ''}
            ${!isCurrentMonth ? 'opacity-30' : ''}
          `}
        >
          {date.getDate()}
        </button>
      )
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
        </div>
        <div className='grid grid-cols-7 gap-2 text-center text-sm font-medium text-slate-600 mb-2'>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className='py-2'>{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days}
        </div>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (Object.keys(availability).length > 0 && !hasAnyAvailability()) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No Available Appointments</h2>
            <p className="text-slate-600 mb-6">
              Dr. {doctor.firstName} {doctor.lastName} currently has no available appointment slots.
              Please check back later or contact the clinic directly.
            </p>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-10xl mx-auto p-6 space-y-8">
      {/* Doctor Info Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <CardContent className="p-8">
          <div className="flex items-start space-x-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">
                Dr. {doctor.firstName} {doctor.lastName}
              </h1>
              <p className="text-blue-100 text-lg mb-4 capitalize">{doctor.specialization}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3">
                  <Stethoscope className="h-5 w-5" />
                  <div>
                    <p className="font-semibold">{doctor.experience} Years</p>
                    <p className="text-xs text-blue-100">Experience</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3">
                  <CheckCircle2 className="h-5 w-5" />
                  <div>
                    <p className="font-semibold">{doctor.rating.toFixed(1)} Rating</p>
                    <p className="text-xs text-blue-100">Patient reviews</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3">
                  <DollarSign className="h-5 w-5" />
                  <div>
                    <p className="font-semibold">₦{doctor.consultationFee}</p>
                    <p className="text-xs text-blue-100">Consultation fee</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[
          { step: "select", label: "Select Date & Time", icon: Calendar },
          { step: "details", label: "Appointment Details", icon: User },
          { step: "confirm", label: "Confirm & Pay", icon: CheckCircle2 }
        ].map(({ step, label, icon: Icon }, index) => (
          <div key={step} className="flex items-center">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              bookingStep === step 
                ? 'bg-blue-600 text-white' 
                : index < ['select', 'details', 'confirm'].indexOf(bookingStep)
                  ? 'bg-green-100 text-green-700'
                  : 'bg-slate-100 text-slate-500'
            }`}>
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{label}</span>
            </div>
            {index < 2 && (
              <div className="w-8 h-0.5 bg-slate-200 mx-2"></div>
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Date & Time Selection */}
      {bookingStep === "select" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Select Date</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {getAvailableDates().length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <p className="text-slate-600 mb-4">No available dates found</p>
                  <p className="text-sm text-slate-500">This doctor hasn&apos;t set their availability yet.</p>
                </div>
              ) : (
                <>
                  {renderCalendar()}
                  <div className="flex items-center justify-center space-x-6 mt-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-200 rounded-full"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      <span>Selected</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-green-600" />
                <span>Available Times</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {selectedDate ? (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600 mb-4">
                    {formatDate(selectedDate)}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {getAvailableSlots().map((slot) => (
                      <Button
                        key={slot.time}
                        variant={selectedTime === slot.time ? "default" : "outline"}
                        className={`h-12 ${selectedTime === slot.time ? "bg-blue-600" : ""}`}
                        onClick={() => setSelectedTime(slot.time)}
                      >
                        {slot.time}
                      </Button>
                    ))}
                  </div>
                  {selectedTime && (
                    <Button 
                      className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                      onClick={() => setBookingStep("details")}
                    >
                      Continue to Details
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">Please select a date first</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 2: Appointment Details */}
      {bookingStep === "details" && (
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-purple-600" />
              <span>Appointment Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                <Label>Consultation Type</Label>
                <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Video className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Video Consultation Only</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Symptoms or Reason for Visit (Optional)</Label>
              <Textarea
                placeholder="Please describe your symptoms or reason for the consultation..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setBookingStep("select")}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={() => setBookingStep("confirm")}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Continue to Confirmation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Confirmation */}
      {bookingStep === "confirm" && (
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span>Confirm Appointment</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-lg">Appointment Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Doctor</p>
                    <p className="font-medium">Dr. {doctor.firstName} {doctor.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Specialization</p>
                    <p className="font-medium capitalize">{doctor.specialization}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Date & Time</p>
                    <p className="font-medium">{selectedDate && formatDate(selectedDate)} at {selectedTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Type</p>
                    <Badge variant="default">
                      Video Consultation
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Consultation Fee</p>
                    <p className="font-medium text-green-600">₦{doctor.consultationFee}</p>
                  </div>
                </div>
                {symptoms && (
                  <div>
                    <p className="text-sm text-slate-600">Symptoms/Reason</p>
                    <p className="font-medium">{symptoms}</p>
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => setBookingStep("details")}
                  className="flex-1"
                >
                  Back to Details
                </Button>
                <Button 
                  onClick={handleBookAppointment}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Booking...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Confirm & Pay
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}