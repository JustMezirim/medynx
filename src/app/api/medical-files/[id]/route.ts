import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyToken(request)
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