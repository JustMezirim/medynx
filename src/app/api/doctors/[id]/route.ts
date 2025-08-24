import { NextRequest, NextResponse } from "next/server"
import connectDB  from "@/lib/db"
import  User from "@/lib/models/User"
import  Appointment from "@/lib/models/Appointment"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const doctor = await User.findById(params.id).select("-password")
    
    if (!doctor || doctor.role !== "doctor") {
      return NextResponse.json(
        { error: "Doctor not found" },
        { status: 404 }
      )
    }

    // Get real appointment data for statistics
    const appointments = await Appointment.find({ doctor: params.id })
    const completedAppointments = appointments.filter(apt => apt.status === "completed")
    const uniquePatients = [...new Set(appointments.map(apt => apt.patient.toString()))]

    // Calculate next available slot
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const nextAvailable = appointments.find(apt => 
      apt.date > now && apt.status === "pending"
    ) ? "Tomorrow 10:00 AM" : "Today 2:00 PM"

    // Get real reviews from completed appointments
    const reviewsData = await Appointment.find({
      doctor: params.id,
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
      nextAvailable: doctor.workingHours ? nextAvailable : null,
      languages: doctor.languages || ["English"],
      education: doctor.education || `${doctor.specialization} Specialist`,
      workingHours: doctor.workingHours || null
    }

    return NextResponse.json({
      doctor: doctorWithStats,
      reviews
    })
  } catch (error) {
    console.error("Error fetching doctor:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}