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

    // Get doctor statistics
    const totalDoctors = await User.countDocuments({ role: "doctor" })
    const verifiedDoctors = await User.countDocuments({ role: "doctor", isVerified: true })
    const activeDoctors = await User.countDocuments({ role: "doctor", isActive: true })
    const pendingDoctors = await User.countDocuments({ role: "doctor", isVerified: false })
    const inactiveDoctors = await User.countDocuments({ role: "doctor", isVerified: true, isActive: false })

    // Get specialization distribution
    const specializationStats = await User.aggregate([
      { $match: { role: "doctor" } },
      { $group: { _id: "$specialization", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])

    return NextResponse.json({
      total: totalDoctors,
      verified: verifiedDoctors,
      active: activeDoctors,
      pending: pendingDoctors,
      inactive: inactiveDoctors,
      specializationStats,
    })
  } catch (error) {
    console.error("Error fetching doctor stats:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}