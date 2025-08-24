import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Specialization from "@/lib/models/Specialization"

export async function GET() {
  try {
    await connectDB()
    const specializations = await Specialization.find({ isActive: true }).select('name description').sort({ name: 1 })
    return NextResponse.json({ specializations })
  } catch (error) {
    console.error('Error fetching specializations:', error)
    return NextResponse.json({ specializations: [] })
  }
}