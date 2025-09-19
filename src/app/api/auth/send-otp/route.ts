import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import { sendOTPEmail, generateOTP } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ message: "Email already verified" }, { status: 400 })
    }

    const otp = generateOTP()
    const expires = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    user.emailVerificationToken = otp
    user.emailVerificationExpires = expires
    await user.save()

    await sendOTPEmail(email, otp, 'verification')

    return NextResponse.json({ 
      message: "OTP sent successfully",
      email 
    })

  } catch (error) {
    console.error("Send OTP error:", error)
    return NextResponse.json({ message: "Failed to send OTP" }, { status: 500 })
  }
}