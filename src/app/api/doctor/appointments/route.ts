import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import { verifyToken } from "@/lib/auth"

// Mock appointments data
const mockAppointments = [
  {
    _id: "1",
    patient: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567"
    },
    date: "2024-01-25",
    timeSlot: "10:00 AM",
    status: "confirmed",
    type: "video",
    symptoms: "Headache and fever",
    amount: 150,
    zoomJoinUrl: "https://zoom.us/j/123456789",
    zoomPassword: "password123"
  },
  {
    _id: "2",
    patient: {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@email.com",
      phone: "+1 (555) 987-6543"
    },
    date: "2024-01-26",
    timeSlot: "2:00 PM",
    status: "pending",
    type: "video",
    symptoms: "Back pain",
    amount: 150
  }
]

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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    let filteredAppointments = mockAppointments

    if (status && status !== "all") {
      filteredAppointments = filteredAppointments.filter(apt => apt.status === status)
    }

    if (search) {
      filteredAppointments = filteredAppointments.filter(apt => 
        `${apt.patient.firstName} ${apt.patient.lastName}`.toLowerCase().includes(search.toLowerCase())
      )
    }

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex)

    return NextResponse.json({
      appointments: paginatedAppointments,
      pagination: {
        page,
        limit,
        total: filteredAppointments.length,
        pages: Math.ceil(filteredAppointments.length / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}