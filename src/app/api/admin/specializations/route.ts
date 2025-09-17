import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Specialization from "@/lib/models/Specialization"
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

    const specializations = await Specialization.find().sort({ createdAt: -1 })
    return NextResponse.json({ specializations })
  } catch {
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
    
    if (payload.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const { name, description } = await request.json()

    const specialization = new Specialization({
      name,
      description
    })

    await specialization.save()
    return NextResponse.json({ specialization }, { status: 201 })
  } catch (error) {
    console.error("Error creating specialization:", error)
    if ((error as { code?: number }).code === 11000) {
      return NextResponse.json({ message: "Specialization already exists" }, { status: 400 })
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}