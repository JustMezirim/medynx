import connectDB from "@/lib/db"
import Settings from "@/lib/models/Settings"

export async function checkMaintenanceMode() {
  try {
    await connectDB()
    const settings = await Settings.findOne()
    return settings?.maintenanceMode || false
  } catch {
    return false
  }
}

export async function checkRegistrationAllowed() {
  try {
    await connectDB()
    const settings = await Settings.findOne()
    return settings?.allowRegistration !== false
  } catch {
    return true
  }
}