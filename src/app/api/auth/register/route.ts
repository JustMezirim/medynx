import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"

// Removed email imports - emails will be sent after verification

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    console.log('Registration request body:', body)
    
    const { firstName, lastName, email, phone, password, role, dateOfBirth, gender, address, specialization, licenseNumber, experience, consultationFee, bio } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !password || !role) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Validate role-specific fields
    if (role === "patient" && (!dateOfBirth || !gender || !address)) {
      return NextResponse.json({ message: "Missing required patient fields: dateOfBirth, gender, address" }, { status: 400 })
    }

    if (role === "doctor" && (!specialization || !licenseNumber || experience === undefined)) {
      return NextResponse.json({ message: "Missing required doctor fields: specialization, licenseNumber, experience" }, { status: 400 })
    }

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
      userData.experience = parseInt(experience) || 0
      userData.consultationFee = consultationFee || 10000
      userData.bio = bio || ""
      userData.rating = 0
      userData.isVerified = false // Doctors need admin approval
    } else if (role === "patient") {
      userData.dateOfBirth = new Date(dateOfBirth)
      userData.gender = gender
      userData.address = address
    }

    console.log('Creating user with data:', userData)
    const user = await User.create(userData)
    console.log('User created successfully:', user._id)

    // Don't send welcome email here - it will be sent after email verification

    return NextResponse.json({ 
      message: role === "doctor" ? "Registration successful. Awaiting admin approval." : "Registration successful",
      user: { id: user._id, email: user.email, role: user.role }
    })
  } catch (error) {
    console.error("Registration error:", error)
    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}