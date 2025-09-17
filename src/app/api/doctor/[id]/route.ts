import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()

    const { id } = await params
    const doctor = await User.findOne({
      _id: id,
      role: "doctor",
      isActive: true,
      isVerified: true
    }).select("-password")

    if (!doctor) {
      return NextResponse.json({ message: "Doctor not found" }, { status: 404 })
    }

    return NextResponse.json({ doctor })
  } catch (error) {
    console.error("Error fetching doctor:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}