import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import MedicalFile from "@/lib/models/MedicalFile"
import User from "@/lib/models/User"

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    let query = { uploadedBy: user.userId }
    if (category && category !== "all") {
      query.category = category
    }

    const files = await MedicalFile.find(query)
      .populate('patient', 'firstName lastName')
      .populate('uploadedBy', 'firstName lastName role')
      .sort({ createdAt: -1 })

    return NextResponse.json({
      files,
      total: files.length,
    })
  } catch (error) {
    console.error("Error fetching medical files:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    const data = await request.json()
    const { patientId, category, description, fileName, fileUrl, fileType, fileSize } = data

    // Verify patient exists
    const patient = await User.findById(patientId)
    if (!patient || patient.role !== 'patient') {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }

    const newFile = await MedicalFile.create({
      fileName,
      fileUrl,
      fileType,
      fileSize,
      category,
      description,
      patient: patientId,
      uploadedBy: user.userId
    })

    const populatedFile = await MedicalFile.findById(newFile._id)
      .populate('patient', 'firstName lastName')
      .populate('uploadedBy', 'firstName lastName role')

    return NextResponse.json(populatedFile, { status: 201 })
  } catch (error) {
    console.error("Error uploading medical file:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}