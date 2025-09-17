import mongoose, { type Document, Schema } from "mongoose"

export interface IAppointment extends Document {
  patient: mongoose.Types.ObjectId
  doctor: mongoose.Types.ObjectId
  date: Date
  timeSlot: string
  status: "payment_pending" | "payment_failed" | "pending" | "confirmed" | "completed" | "cancelled"
  type: "video"
  symptoms?: string
  diagnosis?: string
  prescription?: string
  notes?: string
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  paymentId?: string
  amount: number
  zoomMeetingId?: string
  zoomJoinUrl?: string
  zoomPassword?: string
  dayReminderSent?: boolean
  hourReminderSent?: boolean
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
      enum: ["payment_pending", "payment_failed", "pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    type: { type: String, enum: ["video"], default: "video" },
    symptoms: { type: String },
    diagnosis: { type: String },
    prescription: { type: String },
    notes: { type: String },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentId: { type: String },
    amount: { type: Number, required: true },
    zoomMeetingId: { type: String },
    zoomJoinUrl: { type: String },
    zoomPassword: { type: String },
    dayReminderSent: { type: Boolean, default: false },
    hourReminderSent: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Appointment || mongoose.model<IAppointment>("Appointment", AppointmentSchema)
