import { type NextRequest, NextResponse } from "next/server"
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
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }
    
    if (payload.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    // Get counts
    const totalPatients = await User.countDocuments({ role: "patient" })
    const totalDoctors = await User.countDocuments({ role: "doctor" })
    const totalAdmins = await User.countDocuments({ role: "admin" })
    const totalAppointments = await Appointment.countDocuments()
    const activeUsers = await User.countDocuments({ isActive: true })
    const pendingApprovals = await User.countDocuments({ role: "doctor", isVerified: false })
    const completedAppointments = await Appointment.countDocuments({ status: "completed" })

    // Get today"s appointments
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayAppointments = await Appointment.countDocuments({
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    })

    // Calculate total revenue from completed appointments
    const revenueResult = await Appointment.aggregate([
      { $match: { status: "completed", paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ])
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const sixtyDaysAgo = new Date()
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

    const [currentPatients, previousPatients] = await Promise.all([
      User.countDocuments({ role: "patient", createdAt: { $gte: thirtyDaysAgo } }),
      User.countDocuments({ role: "patient", createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } })
    ])

    const [currentDoctors, previousDoctors] = await Promise.all([
      User.countDocuments({ role: "doctor", createdAt: { $gte: thirtyDaysAgo } }),
      User.countDocuments({ role: "doctor", createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } })
    ])

    const [currentAppointments, previousAppointments] = await Promise.all([
      Appointment.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Appointment.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } })
    ])

    const patientsGrowth = previousPatients > 0 ? ((currentPatients - previousPatients) / previousPatients * 100) : 0
    const doctorsGrowth = previousDoctors > 0 ? ((currentDoctors - previousDoctors) / previousDoctors * 100) : 0
    const appointmentsGrowth = previousAppointments > 0 ? ((currentAppointments - previousAppointments) / previousAppointments * 100) : 0

    // Get recent appointments (limit to 3)
    const recentAppointments = await Appointment.find()
      .populate("patient", "firstName lastName")
      .populate("doctor", "firstName lastName")
      .sort({ createdAt: -1 })
      .limit(3)

    // Get appointment status distribution
    const appointmentStats = await Appointment.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])

    return NextResponse.json({
      stats: {
        totalPatients,
        totalDoctors,
        totalAdmins,
        totalAppointments,
        todayAppointments,
        totalRevenue,
        activeUsers,
        pendingApprovals,
        completedAppointments,
        patientsGrowth: Math.round(patientsGrowth * 10) / 10,
        doctorsGrowth: Math.round(doctorsGrowth * 10) / 10,
        appointmentsGrowth: Math.round(appointmentsGrowth * 10) / 10,
      },
      recentAppointments,
      appointmentStats,
    })
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
