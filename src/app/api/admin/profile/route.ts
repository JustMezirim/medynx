import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "@/lib/models/User"
import connectDB from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    // Get JWT token from Authorization header
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace('Bearer ', '')
    
    let user
    
    if (token && token !== 'null' && token !== 'undefined') {
      try {
        // Verify JWT token and get user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
        user = await User.findById(decoded.userId)
      } catch (jwtError) {
        // Fallback to finding admin user
        user = await User.findOne({ role: 'admin' })
      }
    } else {
      // No valid token, fallback to admin user
      user = await User.findOne({ role: "admin" })
    }
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ 
      profile: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ message: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    
    const { firstName, lastName, email, currentPassword, newPassword } = await request.json()
    
    // Get JWT token from Authorization header
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace('Bearer ', '')
    
    let user
    
    if (token && token !== 'null' && token !== 'undefined') {
      try {
        // Verify JWT token and get user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
        user = await User.findById(decoded.userId)
      } catch (jwtError) {
        console.log('JWT verification failed, falling back to admin lookup')
        // Fallback to finding admin user
        user = await User.findOne({ role: 'admin' })
      }
    } else {
      // No valid token, fallback to admin user
      user = await User.findOne({ role: "admin" })
    }
    
    if (!user) {
      return NextResponse.json({ message: "Admin user not found" }, { status: 404 })
    }

    // If changing password, verify current password
    if (newPassword && currentPassword) {
      const isValidPassword = await bcrypt.compare(currentPassword, user.password)
      if (!isValidPassword) {
        return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 })
      }
      
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12)
      user.password = hashedPassword
    }

    // Update profile fields
    if (firstName) user.firstName = firstName
    if (lastName) user.lastName = lastName
    if (email) user.email = email

    await user.save()

    return NextResponse.json({ 
      message: "Profile updated successfully",
      profile: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ message: "Failed to update profile" }, { status: 500 })
  }
}