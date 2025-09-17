import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Appointment from "@/lib/models/Appointment"

export async function GET() {
  try {
    await connectDB()

    const recentAppointments = await Appointment.find()
      .populate('patient', 'firstName lastName')
      .populate('doctor', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()

    return NextResponse.json({
      recentAppointments: recentAppointments.map(apt => ({
        _id: apt._id,
        patient: apt.patient,
        doctor: apt.doctor,
        date: apt.date,
        time: apt.timeSlot,
        status: apt.status
      }))
    })
  } catch (error) {
    console.error("Recent activity error:", error)
    return NextResponse.json({ recentAppointments: [] })
  }
}