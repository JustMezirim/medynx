import mongoose, { type Document, Schema } from "mongoose"

export interface IMedicalFile extends Document {
  patient: mongoose.Types.ObjectId
  doctor?: mongoose.Types.ObjectId
  appointment?: mongoose.Types.ObjectId
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number
  category: "report" | "prescription" | "image" | "document"
  uploadedBy: mongoose.Types.ObjectId
  description?: string
  createdAt: Date
  updatedAt: Date
}

const MedicalFileSchema = new Schema<IMedicalFile>(
  {
    patient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: Schema.Types.ObjectId, ref: "User" },
    appointment: { type: Schema.Types.ObjectId, ref: "Appointment" },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    category: {
      type: String,
      enum: ["report", "prescription", "image", "document"],
      required: true,
    },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.MedicalFile || mongoose.model<IMedicalFile>("MedicalFile", MedicalFileSchema)