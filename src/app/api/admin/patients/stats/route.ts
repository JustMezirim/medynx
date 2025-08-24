import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import Appointment from "@/lib/models/Appointment"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    let payload
    try {
      payload = await verifyToken(token)
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }
    
    if (payload.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    // Get patient statistics
    const totalPatients = await User.countDocuments({ role: "patient" })
    const activePatients = await User.countDocuments({ role: "patient", isActive: true })
    
    // Get new patients this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)
    
    const newThisMonth = await User.countDocuments({ 
      role: "patient", 
      createdAt: { $gte: startOfMonth } 
    })

    // Get total appointments by patients
    const totalAppointments = await Appointment.countDocuments()

    return NextResponse.json({
      total: totalPatients,
      active: activePatients,
      inactive: totalPatients - activePatients,
      newThisMonth,
      totalAppointments,
    })
  } catch (error) {
    console.error("Error fetching patient stats:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}