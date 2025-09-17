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

    const query: Record<string, unknown> = { role: "doctor" }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { specialization: { $regex: search, $options: "i" } },
      ]
    }

    if (status && status !== "all") {
      if (status === "verified") query.isVerified = true
      if (status === "unverified") query.isVerified = false
      if (status === "active") query.isActive = true
      if (status === "inactive") query.isActive = false
    }

    const skip = (page - 1) * limit

    const doctors = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const doctorsWithStats = await Promise.all(
      doctors.map(async (doctor) => {
        const totalPatients = await Appointment.distinct("patient", { doctor: doctor._id }).then(patients => patients.length)
        const totalAppointments = await Appointment.countDocuments({ doctor: doctor._id })
        
        return {
          ...doctor.toObject(),
          totalPatients,
          totalAppointments,
        }
      })
    )

    const total = await User.countDocuments(query)
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      doctors: doctorsWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: totalPages,
      },
    })
  } catch (error) {
    console.error("Error fetching doctors:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}