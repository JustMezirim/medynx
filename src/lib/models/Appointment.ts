import mongoose, { type Document, Schema } from "mongoose"

export interface IAppointment extends Document {
  patient: mongoose.Types.ObjectId
  doctor: mongoose.Types.ObjectId
  date: Date
  timeSlot: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  type: "video" | "in-person"
  symptoms?: string
  diagnosis?: string
  prescription?: string
  notes?: string
  paymentStatus: "pending" | "paid" | "refunded"
  paymentId?: string
  amount: number
  zoomMeetingId?: string
  zoomJoinUrl?: string
  zoomPassword?: string
  createdAt: Date
  updatedAt: Date
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    patient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    type: { type: String, enum: ["video", "in-person"], default: "video" },
    symptoms: { type: String },
    diagnosis: { type: String },
    prescription: { type: String },
    notes: { type: String },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
    paymentId: { type: String },
    amount: { type: Number, required: true },
    zoomMeetingId: { type: String },
    zoomJoinUrl: { type: String },
    zoomPassword: { type: String },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Appointment || mongoose.model<IAppointment>("Appointment", AppointmentSchema)
