import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Settings from "@/lib/models/Settings"

async function getSettings() {
  try {
    await connectDB()
    let settings = await Settings.findOne()
    if (!settings) {
      // Create default settings if none exist
      settings = await Settings.create({
        siteName: "Medynx",
        contactEmail: "admin@Medynx.com",
        allowRegistration: true,
        maintenanceMode: false
      })
    }
    return settings
  } catch (error) {
    console.error('Error reading settings:', error)
    return {
      siteName: 'Medynx',
      contactEmail: "admin@Medynx.com",
      allowRegistration: true,
      maintenanceMode: false
    }
  }
}

export async function GET() {
  try {
    const settings = await getSettings()
    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Settings fetch error:", error)
    return NextResponse.json({ message: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    const newSettings = await request.json()
    
    let settings = await Settings.findOne()
    if (!settings) {
      settings = new Settings(newSettings)
    } else {
      Object.assign(settings, newSettings)
    }
    
    await settings.save()
    console.log('Settings saved:', settings)
    
    return NextResponse.json({ 
      message: 'Settings saved successfully',
      settings: settings
    })
  } catch (error) {
    console.error("Settings save error:", error)
    return NextResponse.json({ message: "Failed to save settings" }, { status: 500 })
  }
}