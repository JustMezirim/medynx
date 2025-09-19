import { NextRequest, NextResponse } from "next/server"
import { verifyToken, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value
    
    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 })
    }

    const decoded = await verifyToken(refreshToken)
    
    // Verify it's a refresh token
    if (decoded.type !== 'refresh') {
      return NextResponse.json({ error: "Invalid token type" }, { status: 401 })
    }

    // Generate new access token
    const newToken = generateToken({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    })

    const response = NextResponse.json({ success: true })
    
    // Set new access token cookie
    const isProduction = process.env.NODE_ENV === 'production'
    response.headers.set(
      "Set-Cookie",
      `token=${newToken}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${60 * 60}${isProduction ? '; Secure' : ''}`
    )

    return response
  } catch (error) {
    console.error("Token refresh failed:", error)
    return NextResponse.json({ error: "Token refresh failed" }, { status: 401 })
  }
}