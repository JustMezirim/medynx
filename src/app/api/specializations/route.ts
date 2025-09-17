import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Specialization from "@/lib/models/Specialization"

export async function GET() {
  try {
    await connectDB()
    const specializations = await Specialization.find().sort({ name: 1 })
    return NextResponse.json({ 
      specializations: specializations.map(spec => spec.name) 
    })
  } catch (error) {
    console.error("Error fetching specializations:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}