import { type NextRequest, NextResponse } from "next/server"
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

    const payload = await verifyToken(token)
    if (payload.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search")
    const status = searchParams.get("status")

    const query: any = {}

    if (status && status !== "all") {
      query.paymentStatus = status
    }

    const skip = (page - 1) * limit

    let payments = await Appointment.find(query)
      .populate("patient", "firstName lastName email")
      .populate("doctor", "firstName lastName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    if (search) {
      payments = payments.filter(
        (payment: any) =>
          payment.patient.firstName.toLowerCase().includes(search.toLowerCase()) ||
          payment.patient.lastName.toLowerCase().includes(search.toLowerCase()) ||
          payment.transactionId?.toLowerCase().includes(search.toLowerCase()),
      )
    }

    // Calculate stats
    const totalRevenue = await Appointment.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])

    const totalTransactions = await Appointment.countDocuments()
    const successfulPayments = await Appointment.countDocuments({ paymentStatus: "paid" })
    const refundedAmount = await Appointment.aggregate([
      { $match: { paymentStatus: "refunded" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])
    const pendingPayments = await Appointment.countDocuments({ paymentStatus: "pending" })

    const stats = {
      totalRevenue: totalRevenue[0]?.total || 0,
      totalTransactions,
      successfulPayments,
      refundedAmount: refundedAmount[0]?.total || 0,
      pendingPayments,
    }

    const total = await Appointment.countDocuments(query)
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      payments: payments.map((payment: any) => ({
        _id: payment._id,
        appointment: {
          _id: payment._id,
          patient: payment.patient,
          doctor: payment.doctor,
          date: payment.date,
          time: payment.time,
        },
        amount: payment.amount,
        status: payment.paymentStatus,
        paymentMethod: payment.paymentMethod || "card",
        transactionId: payment.transactionId || `TXN${payment._id.toString().slice(-8)}`,
        createdAt: payment.createdAt,
        refundedAt: payment.refundedAt,
        refundAmount: payment.refundAmount,
      })),
      stats,
      pagination: {
        page,
        limit,
        total,
        pages: totalPages,
      },
    })
  } catch (error) {
    console.error("Error fetching payments:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
