import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import { verifyToken } from "@/lib/auth"
import { addNotification } from "@/lib/notifications"
import { sendDoctorApprovalEmail, sendDoctorDeactivationEmail, sendDoctorReactivationEmail } from "@/lib/email"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params
    const { isVerified, isActive } = await request.json()
    const updateData: Record<string, boolean> = {}

    const currentDoctor = await User.findById(id)
    if (!currentDoctor) {
      return NextResponse.json({ message: "Doctor not found" }, { status: 404 })
    }

    if (typeof isVerified === "boolean") {
      updateData.isVerified = isVerified
      if (isVerified === true) {
        updateData.isActive = true
      }
    }
    if (typeof isActive === "boolean") updateData.isActive = isActive

    const doctor = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password")

    // Send notifications and emails for status changes
    try {
      if (typeof isVerified === "boolean" && isVerified !== currentDoctor.isVerified) {
        if (isVerified) {
          await Promise.all([
            sendDoctorApprovalEmail(doctor.email, doctor.firstName, doctor.lastName),
            addNotification({
              recipient: doctor._id.toString(),
              title: "Account Approved",
              message: "Your doctor account has been approved by admin. You can now accept appointments.",
              type: "approval"
            })
          ])
        } else {
          addNotification({
            recipient: doctor._id.toString(),
            title: "Account Suspended",
            message: "Your doctor account has been suspended. Please contact admin for more information.",
            type: "suspension"
          })
        }
      }

      if (typeof isActive === "boolean" && isActive !== currentDoctor.isActive) {
        if (isActive) {
          await Promise.all([
            sendDoctorReactivationEmail(doctor.firstName, doctor.lastName, doctor.email),
            addNotification({
              recipient: doctor._id.toString(),
              title: "Account Reactivated",
              message: "Your account has been reactivated.",
              type: "reactivation"
            })
          ])
        } else {
          await Promise.all([
            sendDoctorDeactivationEmail(doctor.email, doctor.firstName, doctor.lastName),
            addNotification({
              recipient: doctor._id.toString(),
              title: "Account Deactivated",
              message: "Your account has been deactivated.",
              type: "deactivation"
            })
          ])
        }
      }
    } catch (emailError) {
      console.error("Failed to send status change email:", emailError)
    }

    return NextResponse.json({ doctor })
  } catch (error) {
    console.error("Error updating doctor:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}