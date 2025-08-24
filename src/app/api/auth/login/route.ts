import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import { verifyPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { email, password } = await request.json()

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

    // Check doctor account status
    if (user.role === "doctor") {
      if (user.isVerified === false) {
        return NextResponse.json({ 
          // message: "Your account is pending approval. Please wait for admin verification.",
          pending: true 
        }, { status: 403 })
      }
      if (user.isActive === false) {
        return NextResponse.json({ 
          message: "Your account has been deactivated. Please contact support for assistance.",
          deactivated: true 
        }, { status: 403 })
      }
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
    response.headers.set(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`
    )

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
