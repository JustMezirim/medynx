import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import { verifyToken } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      password, 
      role,
      specialization,
      licenseNumber,
      experience,
      consultationFee,
      dateOfBirth,
      gender
    } = body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const userData: any = {
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role,
      isActive: true,
    }

    if (role === "doctor") {
      userData.specialization = specialization
      userData.licenseNumber = licenseNumber
      userData.experience = experience || 0
      userData.consultationFee = consultationFee || 0
      userData.rating = 0
      userData.isVerified = false
    } else if (role === "patient") {
      userData.dateOfBirth = dateOfBirth
      userData.gender = gender
    }

    const user = new User(userData)
    await user.save()

    const userResponse = user.toObject()
    delete userResponse.password

    return NextResponse.json({ 
      message: `${role === "doctor" ? "Doctor" : "Patient"} created successfully`,
      user: userResponse 
    })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}