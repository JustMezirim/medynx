import { NextRequest, NextResponse } from "next/server"
import connectDB  from "@/lib/db"
import  User from "@/lib/models/User"
import  Appointment from "@/lib/models/Appointment"
import Availability from "@/lib/models/Availability"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const { id } = await params
    const doctor = await User.findById(id).select("-password")
    
    if (!doctor || doctor.role !== "doctor") {
      return NextResponse.json(
        { error: "Doctor not found" },
        { status: 404 }
      )
    }

    // Check if doctor has future available slots
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const hasAvailability = await Availability.findOne({
      doctor: id,
      date: { $gte: today },
      'timeSlots.isBooked': false
    })

    // Get real appointment data for statistics
    const appointments = await Appointment.find({ doctor: id })
    const uniquePatients = [...new Set(appointments.map(apt => apt.patient.toString()))]

    // Get real reviews from completed appointments
    const reviewsData = await Appointment.find({
      doctor: id,
      status: "completed",
      rating: { $exists: true }
    }).populate("patient", "firstName lastName").limit(10)

    const reviews = reviewsData.map(apt => ({
      _id: apt._id,
      patientName: `${apt.patient.firstName} ${apt.patient.lastName.charAt(0)}.`,
      rating: apt.rating || 5,
      comment: apt.feedback || "Great consultation!",
      date: apt.date.toISOString().split('T')[0]
    }))

    const doctorWithStats = {
      ...doctor.toObject(),
      totalPatients: uniquePatients.length,
      totalReviews: reviews.length,
      hasAvailability: !!hasAvailability,
      languages: doctor.languages || ["English"],
      education: doctor.education || `${doctor.specialization} Specialist`
    }

    const response = NextResponse.json({
      doctor: doctorWithStats,
      reviews
    })
    
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    return response
  } catch (error) {
    console.error("Error fetching doctor:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}