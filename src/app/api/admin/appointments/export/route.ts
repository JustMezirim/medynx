import { NextRequest, NextResponse } from "next/server"
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

    let payload
    try {
      payload = await verifyToken(token)
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }
    
    if (payload.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const appointments = await Appointment.find()
      .populate("patient", "firstName lastName email phone")
      .populate("doctor", "firstName lastName specialization")
      .sort({ createdAt: -1 })

    const csvHeaders = [
      "Patient Name",
      "Patient Email", 
      "Doctor Name",
      "Specialization",
      "Date",
      "Time",
      "Type",
      "Status",
      "Amount",
      "Payment Status",
      "Booked Date"
    ]

    const csvRows = appointments.map(appointment => [
      `${appointment.patient.firstName} ${appointment.patient.lastName}`,
      appointment.patient.email,
      `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
      appointment.doctor.specialization,
      new Date(appointment.date).toLocaleDateString(),
      appointment.timeSlot,
      appointment.type,
      appointment.status,
      `₦${appointment.amount}`,
      appointment.paymentStatus,
      new Date(appointment.createdAt).toLocaleDateString()
    ])

    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map(row => row.map(field => `"${field}"`).join(","))
    ].join("\n")

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="appointments-${new Date().toISOString().split("T")[0]}.csv"`
      }
    })
  } catch (error) {
    console.error("Error exporting appointments:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}