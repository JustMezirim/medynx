import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import { verifyToken } from "@/lib/auth"
import { sendDoctorApprovalEmail, sendDoctorDeactivationEmail, sendDoctorVerificationEmail, sendDoctorReactivationEmail } from "@/lib/email"

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

    const { isVerified, isActive } = await request.json()
    const updateData: any = {}

    // Get current doctor data for comparison
    const currentDoctor = await User.findById(params.id)
    if (!currentDoctor) {
      return NextResponse.json({ message: "Doctor not found" }, { status: 404 })
    }

    if (typeof isVerified === "boolean") {
      updateData.isVerified = isVerified
      // When approving a doctor, also set them as active
      if (isVerified === true) {
        updateData.isActive = true
      }
    }
    if (typeof isActive === "boolean") updateData.isActive = isActive

    const doctor = await User.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    ).select("-password")

    // Send email notifications
    try {
      if (typeof isActive === "boolean" && isActive !== currentDoctor.isActive) {
        if (isActive) {
          // If doctor was previously inactive and is being reactivated
          if (!currentDoctor.isActive) {
            await sendDoctorReactivationEmail((doctor as any).email, (doctor as any).firstName, (doctor as any).lastName)
          } else {
            await sendDoctorApprovalEmail((doctor as any).email, (doctor as any).firstName, (doctor as any).lastName)
          }
        } else {
          await sendDoctorDeactivationEmail((doctor as any).email, (doctor as any).firstName, (doctor as any).lastName)
        }
      }

      if (typeof isVerified === "boolean" && isVerified !== currentDoctor.isVerified) {
        if (isVerified) {
          await sendDoctorVerificationEmail((doctor as any).email, (doctor as any).firstName, (doctor as any).lastName)
        }
        // Removed unverify email functionality as requested
      }
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError)
    }

    return NextResponse.json({ doctor })
  } catch (error) {
    console.error("Error updating doctor:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

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
    const { firstName, lastName, email, phone, specialization, licenseNumber, experience, consultationFee, bio } = updateData

    const doctor = await User.findByIdAndUpdate(
      params.id,
      {
        firstName,
        lastName,
        email,
        phone,
        specialization,
        licenseNumber,
        experience,
        consultationFee,
        bio
      },
      { new: true }
    ).select("-password")

    if (!doctor) {
      return NextResponse.json({ message: "Doctor not found" }, { status: 404 })
    }

    return NextResponse.json({ doctor })
  } catch (error) {
    console.error("Error updating doctor:", error)
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

    const doctor = await User.findById(params.id)
    if (!doctor) {
      return NextResponse.json({ message: "Doctor not found" }, { status: 404 })
    }

    if (doctor.role !== "doctor") {
      return NextResponse.json({ message: "User is not a doctor" }, { status: 400 })
    }

    await User.findByIdAndDelete(params.id)

    return NextResponse.json({ message: "Doctor deleted successfully" })
  } catch (error) {
    console.error("Error deleting doctor:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}