import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Appointment from "@/lib/models/Appointment"
import { verifyToken } from "@/lib/auth"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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
    
    if (payload.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const { id } = params
    const body = await request.json()

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      body,
      { new: true }
    ).populate("patient", "firstName lastName email")
     .populate("doctor", "firstName lastName specialization")

    if (!appointment) {
      return NextResponse.json({ message: "Appointment not found" }, { status: 404 })
    }

    return NextResponse.json({ appointment })
  } catch (error) {
    console.error("Error updating appointment:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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
    
    if (payload.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const { id } = params

    const appointment = await Appointment.findByIdAndDelete(id)

    if (!appointment) {
      return NextResponse.json({ message: "Appointment not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Appointment deleted successfully" })
  } catch (error) {
    console.error("Error deleting appointment:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}