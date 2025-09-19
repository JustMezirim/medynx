import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Appointment from "@/lib/models/Appointment"

export async function GET() {
  try {
    await connectDB()

    const appointmentStats = await Appointment.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ])

    return NextResponse.json({
      appointmentStats
    })
  } catch (error) {
    console.error("Charts data error:", error)
    return NextResponse.json({
      appointmentStats: []
    })
  }
}