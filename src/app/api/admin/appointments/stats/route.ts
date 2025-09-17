import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
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
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }
    
    if (payload.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const totalAppointments = await Appointment.countDocuments()
    const scheduledAppointments = await Appointment.countDocuments({ status: "scheduled" })
    const completedAppointments = await Appointment.countDocuments({ status: "completed" })
    const cancelledAppointments = await Appointment.countDocuments({ status: "cancelled" })
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const todayAppointments = await Appointment.countDocuments({
      date: { $gte: today, $lt: tomorrow },
    })

    const revenueResult = await Appointment.aggregate([
      { $match: { status: "completed", paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ])
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0

    return NextResponse.json({
      total: totalAppointments,
      scheduled: scheduledAppointments,
      completed: completedAppointments,
      cancelled: cancelledAppointments,
      todayAppointments,
      totalRevenue,
    })
  } catch (error) {
    console.error("Error fetching appointment stats:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}