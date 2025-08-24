import mongoose, { type Document, Schema } from "mongoose"

export interface IUser extends Document {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  role: "patient" | "doctor" | "admin"
  isActive: boolean
  createdAt: Date
  updatedAt: Date

  // Patient-specific fields
  dateOfBirth?: Date
  gender?: string
  address?: string

  // Doctor-specific fields
  specialization?: string
  licenseNumber?: string
  experience?: number
  bio?: string
  rating?: number
  consultationFee?: number
  isVerified?: boolean
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["patient", "doctor", "admin"], required: true },
    isActive: { type: Boolean, default: true },

    // Patient fields
    dateOfBirth: { type: Date },
    gender: { type: String },
    address: { type: String },

    // Doctor fields
    specialization: { type: String },
    licenseNumber: { type: String },
    experience: { type: Number },
    bio: { type: String },
    rating: { type: Number, default: 0 },
    consultationFee: { type: Number, default: 10000 },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
