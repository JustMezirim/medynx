import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import Appointment from "@/lib/models/Appointment"
import { verifyToken } from "@/lib/auth"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const updateData = await request.json()
    const { firstName, lastName, email, phone, dateOfBirth, gender, address, emergencyContact } = updateData

    const patient = await User.findByIdAndUpdate(
      params.id,
      {
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        gender,
        address,
        emergencyContact
      },
      { new: true }
    ).select("-password")

    if (!patient) {
      return NextResponse.json({ message: "Patient not found" }, { status: 404 })
    }

    return NextResponse.json({ patient })
  } catch (error) {
    console.error("Error updating patient:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

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

    const patient = await User.findOneAndUpdate(
      { _id: id, role: "patient" },
      body,
      { new: true }
    ).select("-password")

    if (!patient) {
      return NextResponse.json({ message: "Patient not found" }, { status: 404 })
    }

    return NextResponse.json({ patient })
  } catch (error) {
    console.error("Error updating patient:", error)
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

    // Check if patient has appointments
    const appointmentCount = await Appointment.countDocuments({ patient: id })
    if (appointmentCount > 0) {
      return NextResponse.json({ 
        message: "Cannot delete patient with existing appointments" 
      }, { status: 400 })
    }

    const patient = await User.findOneAndDelete({ _id: id, role: "patient" })

    if (!patient) {
      return NextResponse.json({ message: "Patient not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Patient deleted successfully" })
  } catch (error) {
    console.error("Error deleting patient:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}