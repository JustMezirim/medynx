import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const user = await verifyToken(token)
    if (!user || user.role !== "doctor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { id } = params

    // Mock file deletion
    console.log(`Deleting medical file with ID: ${id}`)

    return NextResponse.json({ message: "Medical file deleted successfully" })
  } catch (error) {
    console.error("Error deleting medical file:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}