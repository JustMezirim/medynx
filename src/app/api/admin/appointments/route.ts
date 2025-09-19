import { type NextRequest, NextResponse } from "next/server"
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

    const payload = await verifyToken(token)
    if (payload.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search")
    const status = searchParams.get("status")
    const type = searchParams.get("type")
    const paymentStatus = searchParams.get("paymentStatus")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    const query: Record<string, string> = {}

    if (status && status !== "all") {
      query.status = status
    }

    if (type && type !== "all") {
      query.type = type
    }

    if (paymentStatus && paymentStatus !== "all") {
      query.paymentStatus = paymentStatus
    }

    const skip = (page - 1) * limit
    const sortOptions: { [key: string]: 1 | -1 } = {}
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1

    let appointments = await Appointment.find(query)
      .populate("patient", "firstName lastName email phone")
      .populate("doctor", "firstName lastName specialization consultationFee")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)

    if (search) {
      appointments = appointments.filter(
        (appointment: { patient: { firstName: string; lastName: string; email: string }; doctor: { firstName: string; lastName: string } }) =>
          appointment.patient.firstName.toLowerCase().includes(search.toLowerCase()) ||
          appointment.patient.lastName.toLowerCase().includes(search.toLowerCase()) ||
          appointment.doctor.firstName.toLowerCase().includes(search.toLowerCase()) ||
          appointment.doctor.lastName.toLowerCase().includes(search.toLowerCase()) ||
          appointment.patient.email.toLowerCase().includes(search.toLowerCase())
      )
    }

    const total = await Appointment.countDocuments(query)
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      appointments,
      pagination: {
        page,
        limit,
        total,
        pages: totalPages,
      },
    })
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}