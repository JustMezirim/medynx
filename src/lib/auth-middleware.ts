import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import { verifyToken } from "@/lib/auth"

export async function withAuth(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    await connectDB()
    const payload = await verifyToken(token)
    
    const user = await User.findById(payload.userId)
    if (!user || !user.isActive) {
      return NextResponse.json({ 
        message: "Account deactivated", 
        deactivated: true 
      }, { status: 403 })
    }

    return { user, payload }
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 })
  }
}