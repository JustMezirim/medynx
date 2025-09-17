import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import MedicalFile from "@/lib/models/MedicalFile"
import { verifyToken } from "@/lib/auth"

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
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get("patientId")
    const category = searchParams.get("category")

    // Build query based on user role
    const query: Record<string, unknown> = {}

    if (payload.role === "patient") {
      query.patient = payload.userId
    } else if (payload.role === "doctor") {
      if (patientId) {
        query.patient = patientId
      } else {
        query.doctor = payload.userId
      }
    } else if (payload.role === "admin") {
      if (patientId) {
        query.patient = patientId
      }
    }

    if (category && category !== "all") {
      query.category = category
    }

    const files = await MedicalFile.find(query)
      .populate("patient", "firstName lastName")
      .populate("doctor", "firstName lastName")
      .populate("uploadedBy", "firstName lastName role")
      .sort({ createdAt: -1 })

    return NextResponse.json({ files })
  } catch (error) {
    console.error("Error fetching medical files:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

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
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }
    const { patientId, fileName, fileUrl, fileType, fileSize, category, description, appointmentId } =
      await request.json()

    // Determine patient ID based on user role
    let finalPatientId = patientId
    if (payload.role === "patient") {
      finalPatientId = payload.userId
    }

    const medicalFile = new MedicalFile({
      patient: finalPatientId,
      doctor: payload.role === "doctor" ? payload.userId : undefined,
      appointment: appointmentId,
      fileName,
      fileUrl,
      fileType,
      fileSize,
      category,
      description,
      uploadedBy: payload.userId,
    })

    await medicalFile.save()

    return NextResponse.json(
      {
        message: "File uploaded successfully",
        file: medicalFile,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error uploading medical file:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
