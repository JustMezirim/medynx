import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import { hashPassword } from "@/lib/auth"
import { sendWelcomeEmail, sendDoctorRegistrationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      role,
      // Patient fields
      dateOfBirth,
      gender,
      address,
      // Doctor fields
      specialization,
      licenseNumber,
      experience,
      bio,
    } = body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user data
    const userData: Record<string, unknown> = {
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role,
    }

    // Add role-specific fields
    if (role === "patient") {
      userData.dateOfBirth = dateOfBirth
      userData.gender = gender
      userData.address = address
    } else if (role === "doctor") {
      userData.specialization = specialization
      userData.licenseNumber = licenseNumber
      userData.experience = experience
      userData.bio = bio
      userData.consultationFee = 10000 // Default fee in Naira
      userData.isVerified = false // Doctors need approval
    }

    // Create user
    const user = new User(userData)
    await user.save()

    // Send registration email
    try {
      if (role === "patient") {
        await sendWelcomeEmail(email, firstName, lastName)
      } else if (role === "doctor") {
        await sendDoctorRegistrationEmail(email, firstName, lastName, specialization, licenseNumber, experience)
      }
    } catch (emailError) {
      console.error("Failed to send registration email:", emailError)
    }

    return NextResponse.json({ message: "User created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
