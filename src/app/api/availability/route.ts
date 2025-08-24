import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Availability from "@/lib/models/Availability"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const doctorId = searchParams.get("doctorId")
    const date = searchParams.get("date")

    if (!doctorId || !date) {
      return NextResponse.json({ message: "Doctor ID and date are required" }, { status: 400 })
    }

    const availability = await Availability.findOne({
      doctor: doctorId,
      date: new Date(date)
    })

    return NextResponse.json({ availability })
  } catch (error) {
    console.error("Error fetching availability:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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
    
    if (payload.role !== "doctor") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const { date, timeSlots } = await request.json()

    // Check if availability already exists for this date
    const existingAvailability = await Availability.findOne({
      doctor: payload.userId,
      date: new Date(date)
    })

    if (existingAvailability) {
      // Update existing availability
      existingAvailability.timeSlots = timeSlots
      await existingAvailability.save()
      return NextResponse.json({ message: "Availability updated successfully" })
    } else {
      // Create new availability
      const availability = new Availability({
        doctor: payload.userId,
        date: new Date(date),
        timeSlots
      })
      await availability.save()
      return NextResponse.json({ message: "Availability saved successfully" })
    }
  } catch (error) {
    console.error("Error saving availability:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
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
    
    if (payload.role !== "doctor") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")

    if (!date) {
      return NextResponse.json({ message: "Date is required" }, { status: 400 })
    }

    await Availability.findOneAndDelete({
      doctor: payload.userId,
      date: new Date(date)
    })

    return NextResponse.json({ message: "Availability deleted successfully" })
  } catch (error) {
    console.error("Error deleting availability:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
