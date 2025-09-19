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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search")
    const status = searchParams.get("status")
    const gender = searchParams.get("gender")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    const query: Record<string, unknown> = { role: "patient" }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ]
    }

    if (status && status !== "all") {
      if (status === "active") query.isActive = true
      if (status === "inactive") query.isActive = false
    }

    if (gender && gender !== "all") {
      query.gender = gender
    }

    const skip = (page - 1) * limit
    const sortOptions: Record<string, 1 | -1> = {}
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1

    const patients = await User.find(query)
      .select("-password")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)

    const patientsWithStats = await Promise.all(
      patients.map(async (patient) => {
        const appointmentCount = await Appointment.countDocuments({ patient: patient._id })
        const lastAppointment = await Appointment.findOne({ patient: patient._id }).sort({ date: -1 }).select("date")
        
        // Calculate total spent
        const totalSpentResult = await Appointment.aggregate([
          { $match: { patient: patient._id, paymentStatus: "paid" } },
          { $group: { _id: null, total: { $sum: "$amount" } } }
        ])
        const totalSpent = totalSpentResult.length > 0 ? totalSpentResult[0].total : 0

        return {
          ...patient.toObject(),
          appointmentCount,
          lastAppointment: lastAppointment?.date,
          totalSpent,
        }
      }),
    )

    const total = await User.countDocuments(query)
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      patients: patientsWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: totalPages,
      },
    })
  } catch (error) {
    console.error("Error fetching patients:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
