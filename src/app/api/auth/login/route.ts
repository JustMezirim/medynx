import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import { verifyPassword, generateToken } from "@/lib/auth"
import { checkMaintenanceMode } from "@/lib/maintenance"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    // Parse request body once
    const { email, password } = await request.json()

    // Check maintenance mode (allow admin login)
    const isMaintenanceMode = await checkMaintenanceMode()
    if (isMaintenanceMode) {
      const user = await User.findOne({ email })
      if (!user || user.role !== "admin") {
        return NextResponse.json({ message: "System is under maintenance." }, { status: 503 })
      }
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Check account status
    if (!user.isActive) {
      return NextResponse.json({ 
        message: "Account is deactivated. Please contact support.",
        deactivated: true 
      }, { status: 403 })
    }

    // Check doctor verification status
    if (user.role === "doctor" && user.isVerified === false) {
      return NextResponse.json({ 
        message: "Your account is pending approval. Please wait for admin verification.",
        pending: true 
      }, { status: 403 })
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    // Create response without token in body
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
      success: true,
    })

    // Set HTTP-only cookie using Set-Cookie header
    const isProduction = process.env.NODE_ENV === 'production'
    response.headers.set(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}${isProduction ? '; Secure' : ''}`
    )

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
