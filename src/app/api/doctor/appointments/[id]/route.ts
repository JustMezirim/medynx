import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Appointment from "@/lib/models/Appointment"
import { verifyToken } from "@/lib/auth"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded || decoded.role !== 'doctor') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const appointmentId = params.id
    const updates = await request.json()

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctor: decoded.userId
    })

    if (!appointment) {
      return NextResponse.json({ message: "Appointment not found" }, { status: 404 })
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      updates,
      { new: true }
    ).populate('patient', 'firstName lastName email phone')

    return NextResponse.json(updatedAppointment)
  } catch (error) {
    console.error("Update appointment error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}