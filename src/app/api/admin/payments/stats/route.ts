import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Appointment from "@/lib/models/Appointment"

export async function GET() {
  try {
    await connectDB()

    const [
      totalRevenue,
      totalTransactions,
      successfulPayments,
      refundedAmount,
      pendingPayments
    ] = await Promise.all([
      Appointment.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]).then(result => result[0]?.total || 0),
      Appointment.countDocuments({ paymentStatus: { $exists: true } }),
      Appointment.countDocuments({ paymentStatus: "paid" }),
      Appointment.aggregate([
        { $match: { paymentStatus: "refunded" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]).then(result => result[0]?.total || 0),
      Appointment.countDocuments({ paymentStatus: "pending" })
    ])

    return NextResponse.json({
      totalRevenue,
      totalTransactions,
      successfulPayments,
      refundedAmount,
      pendingPayments
    })
  } catch (error) {
    console.error("Payment stats error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}