import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user || user.role !== "doctor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Mock stats data
    const stats = {
      total: 25,
      pending: 3,
      confirmed: 8,
      completed: 12,
      cancelled: 2,
      todayAppointments: 4,
      totalRevenue: 3750
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching appointment stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}