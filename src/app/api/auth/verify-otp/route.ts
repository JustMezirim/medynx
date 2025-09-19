import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ message: "Email and OTP are required" }, { status: 400 })
    }

    const user = await User.findOne({
      email,
      emailVerificationToken: otp,
      emailVerificationExpires: { $gt: new Date() }
    })

    if (!user) {
      return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 })
    }

    // Mark as verified and clear OTP fields
    user.emailVerified = true
    user.emailVerificationToken = undefined
    user.emailVerificationExpires = undefined
    await user.save()

    // Send welcome email after verification
    try {
      const { sendWelcomeEmail, sendDoctorRegistrationEmail } = await import('@/lib/email')
      
      if (user.role === 'doctor') {
        await sendDoctorRegistrationEmail(
          user.email, 
          user.firstName, 
          user.lastName, 
          user.specialization || '', 
          user.licenseNumber || '', 
          user.experience || 0
        )
      } else {
        await sendWelcomeEmail(user.email, user.firstName, user.lastName)
      }
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
    }

    return NextResponse.json({ 
      message: "Email verified successfully",
      verified: true 
    })

  } catch (error) {
    console.error("Verify OTP error:", error)
    return NextResponse.json({ message: "Failed to verify OTP" }, { status: 500 })
  }
}