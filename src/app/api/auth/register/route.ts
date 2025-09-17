import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import Settings from "@/lib/models/Settings"
import { notifyAllAdmins } from "@/lib/notifications"
import { sendWelcomeEmail, sendDoctorRegistrationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    // Check settings
    const settings = await Settings.findOne()
    if (settings?.maintenanceMode) {
      return NextResponse.json({ message: "System is under maintenance. Please try again later." }, { status: 503 })
    }
    if (settings && !settings.allowRegistration) {
      return NextResponse.json({ message: "Registration is currently disabled." }, { status: 403 })
    }

    const { firstName, lastName, email, phone, password, role, dateOfBirth, gender, address, specialization, licenseNumber, experience, consultationFee } = await request.json()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user data
    const userData: Record<string, unknown> = {
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role,
      isActive: true
    }

    // Add role-specific fields
    if (role === "doctor") {
      userData.specialization = specialization
      userData.licenseNumber = licenseNumber
      userData.experience = experience || 0
      userData.consultationFee = consultationFee || 10000
      userData.rating = 0
      userData.isVerified = false // Doctors need admin approval
    } else if (role === "patient") {
      userData.dateOfBirth = dateOfBirth
      userData.gender = gender
      userData.address = address
    }

    const user = await User.create(userData)

    // Send emails and notifications
    try {
      if (role === "doctor") {
        await Promise.all([
          sendDoctorRegistrationEmail(email, firstName, lastName, specialization, licenseNumber, experience || 0),
          notifyAllAdmins({
            title: "New Doctor Registration",
            message: `Dr. ${firstName} ${lastName} has registered and needs approval`,
            type: "system",
            relatedId: user._id.toString()
          })
        ])
      } else {
        await Promise.all([
          sendWelcomeEmail(email, firstName, lastName),
          notifyAllAdmins({
            title: "New User Registration",
            message: `${firstName} ${lastName} has registered as a ${role}`,
            type: "system",
            relatedId: user._id.toString()
          })
        ])
      }
    } catch (emailError) {
      console.error("Failed to send registration email:", emailError)
    }

    return NextResponse.json({ 
      message: role === "doctor" ? "Registration successful. Awaiting admin approval." : "Registration successful",
      user: { id: user._id, email: user.email, role: user.role }
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}