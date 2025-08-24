import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Appointment from "@/lib/models/Appointment"
import User from "@/lib/models/User"
import { verifyToken } from "@/lib/auth"
import { triggerNotificationWebhook, NotificationEvents } from "@/lib/notifications"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "10")
    
    const appointments = await Appointment.find()
      .populate("patient", "firstName lastName email")
      .populate("doctor", "firstName lastName specialization")
      .sort({ createdAt: -1 })
      .limit(limit)
    
    return NextResponse.json(appointments)
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (payload.role !== "patient") {
      return NextResponse.json({ message: "Only patients can book appointments" }, { status: 403 })
    }

    const { doctorId, date, timeSlot, symptoms, type } = await request.json()

    // Get doctor details
    const doctor = await User.findById(doctorId)
    if (!doctor || doctor.role !== "doctor" || !doctor.isActive) {
      return NextResponse.json({ message: "Doctor not found" }, { status: 404 })
    }

    // Check if slot is available (remove this check since we're using default slots)
    // const existingAppointment = await Appointment.findOne({
    //   doctor: doctorId,
    //   date: new Date(date),
    //   timeSlot,
    //   status: { $in: ['pending', "confirmed"] },
    // })

    // if (existingAppointment) {
    //   return NextResponse.json({ message: "Time slot not available" }, { status: 400 })
    // }

    // Create appointment
    const appointment = new Appointment({
      patient: payload.userId,
      doctor: doctorId,
      date: new Date(date),
      timeSlot,
      symptoms,
      type: type || "video",
      amount: doctor.consultationFee || 100,
      status: "pending",
      paymentStatus: "pending",
    })

    await appointment.save()

    // Trigger notification webhook
    await triggerNotificationWebhook(NotificationEvents.APPOINTMENT_CREATED, {
      appointmentId: appointment._id.toString()
    })

    return NextResponse.json(
      {
        message: "Appointment created successfully",
        appointment,
      },
      { status: 201 },
    )
  } catch (error: unknown) {
    console.error("Error creating appointment:", error)
    if ((error as any).name === 'ValidationError') {
      return NextResponse.json({ message: 'Invalid appointment data' }, { status: 400 })
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}