import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import Appointment from "@/lib/models/Appointment"

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
    
    if (payload.role !== "doctor") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const dateRange = searchParams.get("dateRange") || "all"
    
    let dateFilter = {}
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (dateRange === "today") {
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      dateFilter = { date: { $gte: today, $lt: tomorrow } }
    } else if (dateRange === "week") {
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - today.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 7)
      dateFilter = { date: { $gte: weekStart, $lt: weekEnd } }
    } else if (dateRange === "month") {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1)
      dateFilter = { date: { $gte: monthStart, $lt: monthEnd } }
    }

    const baseQuery = { doctor: payload.userId, ...dateFilter }
    const todayQuery = { doctor: payload.userId, date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) } }

    const [total, pending, confirmed, completed, cancelled, todayAppointments] = await Promise.all([
      Appointment.countDocuments(baseQuery),
      Appointment.countDocuments({ ...baseQuery, status: "pending" }),
      Appointment.countDocuments({ ...baseQuery, status: "confirmed" }),
      Appointment.countDocuments({ ...baseQuery, status: "completed" }),
      Appointment.countDocuments({ ...baseQuery, status: "cancelled" }),
      Appointment.countDocuments(todayQuery)
    ])

    const stats = {
      total,
      pending,
      confirmed,
      completed,
      cancelled,
      todayAppointments
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching appointment stats:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}