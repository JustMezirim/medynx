import mongoose, { type Document, Schema } from "mongoose"

export interface ISpecialization extends Document {
  name: string
  description: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const SpecializationSchema = new Schema<ISpecialization>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Specialization || mongoose.model<ISpecialization>("Specialization", SpecializationSchema)