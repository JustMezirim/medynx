import mongoose, { type Document, Schema } from "mongoose"

export interface IAvailability extends Document {
  doctor: mongoose.Types.ObjectId
  date: Date
  timeSlots: {
    time: string
    isBooked: boolean
    appointmentId?: mongoose.Types.ObjectId
  }[]
  createdAt: Date
  updatedAt: Date
}

const AvailabilitySchema = new Schema<IAvailability>(
  {
    doctor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    timeSlots: [
      {
        time: { type: String, required: true },
        isBooked: { type: Boolean, default: false },
        appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment" },
      },
    ],
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Availability || mongoose.model<IAvailability>("Availability", AvailabilitySchema)
