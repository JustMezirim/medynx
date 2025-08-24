import { type NextRequest, NextResponse } from "next/server"
import { initializePayment } from "@/lib/paystack"
import { verifyToken } from "@/lib/auth"
import connectDB from "@/lib/db"
import Appointment from "@/lib/models/Appointment"
import User from "@/lib/models/User"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (payload.role !== "patient") {
      return NextResponse.json({ message: "Only patients can make payments" }, { status: 403 })
    }

    const { appointmentId } = await request.json()

    // Get appointment and user details
    const appointment = await Appointment.findById(appointmentId).populate("doctor", "firstName lastName")

    const patient = await User.findById(payload.userId)

    if (!appointment || !patient) {
      return NextResponse.json({ message: "Appointment or patient not found" }, { status: 404 })
    }

    if (appointment.patient.toString() !== payload.userId) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 })
    }

    if (appointment.paymentStatus === "paid") {
      return NextResponse.json({ message: "Payment already completed" }, { status: 400 })
    }

    // Generate unique reference
    const reference = `apt_${appointmentId}_${Date.now()}`

    // Initialize payment
    const paymentData = await initializePayment(patient.email, appointment.amount, reference, {
      appointmentId,
      patientId: payload.userId,
      doctorId: appointment.doctor._id,
    })

    if (!paymentData.status) {
      return NextResponse.json({ message: "Payment initialization failed" }, { status: 400 })
    }

    // Update appointment with payment reference
    appointment.paymentId = reference
    await appointment.save()

    return NextResponse.json({
      message: "Payment initialized successfully",
      authorizationUrl: paymentData.data.authorization_url,
      reference: paymentData.data.reference,
    })
  } catch (error) {
    console.error("Error initializing payment:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
