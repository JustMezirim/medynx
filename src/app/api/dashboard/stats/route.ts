import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Appointment from "@/lib/models/Appointment"
import User from "@/lib/models/User"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyToken(token)

    if (payload.role === "patient") {
      const totalAppointments = await Appointment.countDocuments({ patient: payload.userId })
      const confirmedAppointments = await Appointment.countDocuments({ 
        patient: payload.userId, 
        status: "confirmed" 
      })
      const completedAppointments = await Appointment.countDocuments({ 
        patient: payload.userId, 
        status: "completed" 
      })
      const pendingAppointments = await Appointment.countDocuments({ 
        patient: payload.userId, 
        status: "pending" 
      })

      return NextResponse.json({
        totalAppointments,
        confirmedAppointments,
        completedAppointments,
        pendingAppointments
      })
    }

    if (payload.role === "doctor") {
      const totalAppointments = await Appointment.countDocuments({ doctor: payload.userId })
      const confirmedAppointments = await Appointment.countDocuments({ 
        doctor: payload.userId, 
        status: "confirmed" 
      })
      const completedAppointments = await Appointment.countDocuments({ 
        doctor: payload.userId, 
        status: "completed" 
      })
      const pendingAppointments = await Appointment.countDocuments({ 
        doctor: payload.userId, 
        status: "pending" 
      })

      // Get unique patients count
      const uniquePatients = await Appointment.distinct("patient", { doctor: payload.userId })
      const totalPatients = uniquePatients.length

      return NextResponse.json({
        totalAppointments,
        confirmedAppointments,
        completedAppointments,
        pendingAppointments,
        totalPatients
      })
    }

    return NextResponse.json({ message: "Invalid role" }, { status: 403 })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}