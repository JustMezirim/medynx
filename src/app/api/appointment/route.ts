import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Appointment from "@/lib/models/Appointment"
import User from "@/lib/models/User"
import { withAuth } from "@/lib/auth-middleware"
// import { createZoomMeeting } from "@/lib/zoom"
// import { webhooks } from "@/lib/webhooks"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const authResult = await withAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { payload } = authResult

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Build query based on user role
    const query: Record<string, unknown> = {}

    if (payload.role === "patient") {
      query.patient = payload.userId
    } else if (payload.role === "doctor") {
      query.doctor = payload.userId
      query.paymentStatus = "paid" // Only show paid appointments to doctors
    }

    if (status && status !== "all") {
      query.status = status
    }

    const appointments = await Appointment.find(query)
      .populate("patient", "firstName lastName email phone")
      .populate("doctor", "firstName lastName specialization")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await Appointment.countDocuments(query)

    return NextResponse.json({
      appointments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const authResult = await withAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { payload } = authResult

    if (payload.role !== "patient") {
      return NextResponse.json({ message: "Only patients can book appointments" }, { status: 403 })
    }

    const { doctorId, date, timeSlot, symptoms, type } = await request.json()

    // Get doctor details
    const doctor = await User.findById(doctorId)
    if (!doctor || doctor.role !== "doctor") {
      return NextResponse.json({ message: "Doctor not found" }, { status: 404 })
    }

    // Check if slot is available (exclude payment_pending as they may not complete payment)
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      timeSlot,
      status: { $in: ["pending", "confirmed"] },
    })

    if (existingAppointment) {
      return NextResponse.json({ message: "Time slot not available" }, { status: 400 })
    }

    // Create appointment with payment_pending status
    const appointment = new Appointment({
      patient: payload.userId,
      doctor: doctorId,
      date: new Date(date),
      timeSlot,
      symptoms,
      type: type || "video",
      amount: doctor.consultationFee || 100,
      status: "pending", // Will be updated after payment
      paymentStatus: "pending",
    })

    await appointment.save()

    // No notifications sent until payment is confirmed

    return NextResponse.json(
      {
        message: "Appointment booking initiated. Please complete payment.",
        appointment,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating appointment:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
