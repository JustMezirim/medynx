import mongoose from "mongoose"

const settingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: "Medynx"
  },
  contactEmail: {
    type: String,
    default: "admin@medynx.com"
  },
  allowRegistration: {
    type: Boolean,
    default: true
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

const Settings = mongoose.models.Settings || mongoose.model("Settings", settingsSchema)

export default Settings