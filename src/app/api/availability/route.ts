import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Availability from "@/lib/models/Availability"
import { verifyToken } from "@/lib/auth"
import { createDateFromString } from "@/lib/date-utils"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const doctorId = searchParams.get("doctorId")
    const date = searchParams.get("date")

    if (!doctorId || !date) {
      return NextResponse.json({ message: "Doctor ID and date are required" }, { status: 400 })
    }

    console.log('Searching availability for doctor:', doctorId, 'date:', date)
    
    // Check what's in the database for this doctor
    const allAvailability = await Availability.find({ doctor: doctorId })
    console.log('All availability for doctor:', allAvailability.map(a => ({ date: a.date, slots: a.timeSlots.length })))
    
    // Try different date formats
    const searchDate = new Date(date)
    const startOfDay = new Date(searchDate)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(searchDate)
    endOfDay.setHours(23, 59, 59, 999)
    
    const availability = await Availability.findOne({
      doctor: doctorId,
      date: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    })
    
    console.log('Found availability:', availability)
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
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }
    
    if (payload.role !== "doctor") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const { date, timeSlots } = await request.json()
    console.log('Received date from frontend:', date)

    // Check if availability already exists for this date
    const searchDate = createDateFromString(date)
    
    const existingAvailability = await Availability.findOne({
      doctor: payload.userId,
      date: searchDate
    })

    if (existingAvailability) {
      // Update existing availability
      existingAvailability.timeSlots = timeSlots
      await existingAvailability.save()
      return NextResponse.json({ message: "Availability updated successfully" })
    } else {
      // Create new availability preserving the exact date
      const exactDate = createDateFromString(date)
      console.log('Created date:', exactDate)
      
      const availability = new Availability({
        doctor: payload.userId,
        date: exactDate,
        timeSlots
      })
      await availability.save()
      return NextResponse.json({ message: "Availability saved successfully" })
    }
  } catch {
    // console.error("Error saving availability:", error)
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
    } catch {
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

    const searchDate = createDateFromString(date)
    
    await Availability.findOneAndDelete({
      doctor: payload.userId,
      date: searchDate
    })

    return NextResponse.json({ message: "Availability deleted successfully" })
  } catch (error) {
    console.error("Error deleting availability:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
