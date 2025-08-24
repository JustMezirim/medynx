import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Appointment from "@/lib/models/Appointment"
import User from "@/lib/models/User"
import { verifyToken } from "@/lib/auth"
import { createZoomMeeting } from "@/lib/zoom"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyToken(token)
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Build query based on user role
    const query: any = {}

    if (payload.role === "patient") {
      query.patient = payload.userId
    } else if (payload.role === "doctor") {
      query.doctor = payload.userId
    }

    if (status && status !== "all") {
      query.status = status
    }

    const appointments = await Appointment.find(query)
      .populate("patient", "firstName lastName email phone")
      .populate("doctor", "firstName lastName specialization")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ date: -1, timeSlot: -1 })

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
    if (!doctor || doctor.role !== "doctor") {
      return NextResponse.json({ message: "Doctor not found" }, { status: 404 })
    }

    // Check if slot is available
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      timeSlot,
      status: { $in: ["pending", "confirmed"] },
    })

    if (existingAppointment) {
      return NextResponse.json({ message: "Time slot not available" }, { status: 400 })
    }

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
    })

    await appointment.save()

    // Zoom meeting will be created after payment confirmation

    return NextResponse.json(
      {
        message: "Appointment created successfully",
        appointment,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating appointment:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
