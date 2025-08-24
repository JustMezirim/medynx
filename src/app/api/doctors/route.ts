import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const specialization = searchParams.get("specialization")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search")

    // Build query
    const query: any = {
      role: "doctor",
      isActive: true,
      isVerified: true,
    }

    if (specialization && specialization !== "all") {
      query.specialization = specialization
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { specialization: { $regex: search, $options: "i" } },
      ]
    }

    // Get doctors with pagination
    const doctors = await User.find(query)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ rating: -1, createdAt: -1 })

    const total = await User.countDocuments(query)

    return NextResponse.json({
      doctors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching doctors:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
