import { NextResponse } from "next/server"
import connectDB from "@/lib/db"

export async function GET() {
  try {
    // Check database connection
    let databaseStatus = "disconnected"
    try {
      await connectDB()
      databaseStatus = "connected"
    } catch {
      databaseStatus = "disconnected"
    }

    // Check server status (always online if we reach this point)
    const serverStatus = "online"

    // Check maintenance mode (could be from env variable or database)
    const maintenanceMode = process.env.MAINTENANCE_MODE === "true" ? "scheduled" : "none"

    return NextResponse.json({
      server: serverStatus,
      database: databaseStatus,
      maintenance: maintenanceMode
    })
  } catch {
    return NextResponse.json({ 
      server: "offline",
      database: "disconnected", 
      maintenance: "unknown"
    }, { status: 500 })
  }
}