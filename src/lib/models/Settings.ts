import mongoose from "mongoose"

const SettingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: "Medynx"
  },
  contactEmail: {
    type: String,
    default: "admin@Medynx.com"
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

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema)