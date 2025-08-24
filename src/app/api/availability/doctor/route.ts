import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Availability from "@/lib/models/Availability"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (payload.role !== "doctor") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const availabilities = await Availability.find({
      doctor: payload.userId
    }).sort({ date: 1 })

    return NextResponse.json({ availabilities })
  } catch (error) {
    console.error("Error fetching doctor availability:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}