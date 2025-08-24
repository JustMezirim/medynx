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
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }
    
    if (payload.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const patients = await User.find({ role: "patient" }).select("-password")

    const patientsWithStats = await Promise.all(
      patients.map(async (patient) => {
        const appointmentCount = await Appointment.countDocuments({ patient: patient._id })
        const lastAppointment = await Appointment.findOne({ patient: patient._id }).sort({ date: -1 }).select("date")
        
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
      })
    )

    // Create CSV content
    const csvHeaders = [
      "First Name",
      "Last Name", 
      "Email",
      "Phone",
      "Gender",
      "Date of Birth",
      "Status",
      "Appointments",
      "Total Spent",
      "Last Appointment",
      "Registration Date"
    ]

    const csvRows = patientsWithStats.map(patient => [
      patient.firstName,
      patient.lastName,
      patient.email,
      patient.phone,
      patient.gender || "",
      patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : "",
      patient.isActive ? "Active" : "Inactive",
      patient.appointmentCount,
      `₦${patient.totalSpent}`,
      patient.lastAppointment ? new Date(patient.lastAppointment).toLocaleDateString() : "Never",
      new Date(patient.createdAt).toLocaleDateString()
    ])

    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map(row => row.map(field => `"${field}"`).join(","))
    ].join("\n")

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="patients-${new Date().toISOString().split('T')[0]}.csv"` 
      }
    })
  } catch (error) {
    console.error("Error exporting patients:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}