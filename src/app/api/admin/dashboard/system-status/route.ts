import { NextResponse } from "next/server"

export async function GET() {
  try {
    return NextResponse.json({
      server: "online",
      database: "connected",
      maintenance: "none"
    })
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}