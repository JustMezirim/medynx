import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import { verifyToken } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    let payload
    try {
      payload = await verifyToken(token)
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const user = await User.findById(payload.userId).select("-password")
    if (!user || !user.isActive) {
      return NextResponse.json({ message: "Account deactivated", logout: true }, { status: 403 })
    }
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Add default values for patient fields if they don't exist
    const profile = {
      ...user.toObject(),
      dateOfBirth: user.dateOfBirth || null,
      gender: user.gender || '',
      address: user.address || ''
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  return await updateProfile(request)
}

export async function PATCH(request: NextRequest) {
  return await updateProfile(request)
}

async function updateProfile(request: NextRequest) {
  try {
    await connectDB()

    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    let payload
    try {
      payload = await verifyToken(token)
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    const { firstName, lastName, phone, dateOfBirth, gender, address, specialization, bio, consultationFee, currentPassword, newPassword } = body

    const user = await User.findById(payload.userId)
    if (!user || !user.isActive) {
      return NextResponse.json({ message: "Account deactivated", logout: true }, { status: 403 })
    }
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Update basic fields
    if (firstName) user.firstName = firstName
    if (lastName) user.lastName = lastName
    if (phone) user.phone = phone
    if (dateOfBirth) user.dateOfBirth = dateOfBirth
    if (gender) user.gender = gender
    if (address) user.address = address

    // Update doctor-specific fields
    if (user.role === "doctor") {
      if (specialization) user.specialization = specialization
      if (bio) user.bio = bio
      if (consultationFee) user.consultationFee = consultationFee
    }

    // Handle password change
    if (currentPassword && newPassword) {
      const isValidPassword = await bcrypt.compare(currentPassword, user.password)
      if (!isValidPassword) {
        return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 })
      }
      user.password = await bcrypt.hash(newPassword, 12)
    }

    await user.save()

    const updatedUser = await User.findById(payload.userId).select("-password")
    return NextResponse.json({ profile: updatedUser, message: "Profile updated successfully" })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}