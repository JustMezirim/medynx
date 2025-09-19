import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { markAsRead } from "@/lib/notifications"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    const { id } = await params
    await markAsRead(decoded.userId, id)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 })
  }
}