import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Appointment from "@/lib/models/Appointment"
import { verifyToken } from "@/lib/auth"
import { addNotification } from "@/lib/notifications"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()

    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyToken(token)
    const { id } = await params
    const appointment = await Appointment.findById(id)
      .populate("patient", "firstName lastName email phone")
      .populate("doctor", "firstName lastName specialization")

    if (!appointment) {
      return NextResponse.json({ message: "Appointment not found" }, { status: 404 })
    }

    // Check if user has access to this appointment
    const hasAccess =
      payload.role === "admin" ||
      (payload.role === "patient" && appointment.patient._id.toString() === payload.userId) ||
      (payload.role === "doctor" && appointment.doctor._id.toString() === payload.userId)

    if (!hasAccess) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 })
    }

    return NextResponse.json({ appointment })
  } catch (error) {
    console.error("Error fetching appointment:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()

    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyToken(token)
    const updates = await request.json()

    const { id } = await params
    const appointment = await Appointment.findById(id)
    if (!appointment) {
      return NextResponse.json({ message: "Appointment not found" }, { status: 404 })
    }

    // Check permissions
    const canUpdate =
      payload.role === "admin" ||
      (payload.role === "doctor" && appointment.doctor.toString() === payload.userId) ||
      (payload.role === "patient" &&
        appointment.patient.toString() === payload.userId &&
        updates.status === "cancelled")

    if (!canUpdate) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 })
    }

    // Update appointment
    const oldStatus = appointment.status
    Object.assign(appointment, updates)
    await appointment.save()

    // Send notifications for status changes
    if (oldStatus !== appointment.status) {
      if (appointment.status === "confirmed") {
        await addNotification({
          recipient: appointment.patient.toString(),
          title: "Appointment Confirmed",
          message: "Your appointment has been confirmed",
          type: "appointment",
          relatedId: appointment._id.toString()
        })
      } else if (appointment.status === "cancelled") {
        await addNotification({
          recipient: appointment.patient.toString(),
          title: "Appointment Cancelled",
          message: "Your appointment has been cancelled",
          type: "appointment",
          relatedId: appointment._id.toString()
        })
      }
    }

    return NextResponse.json({
      message: "Appointment updated successfully",
      appointment,
    })
  } catch (error) {
    console.error("Error updating appointment:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
