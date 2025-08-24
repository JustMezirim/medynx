import mongoose, { type Document, Schema } from "mongoose"

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId
  title: string
  message: string
  type: "appointment" | "payment" | "system" | "reminder"
  isRead: boolean
  relatedId?: mongoose.Types.ObjectId
  relatedModel?: "Appointment" | "Payment" | "User"
  createdAt: Date
  updatedAt: Date
}

const NotificationSchema = new Schema<INotification>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["appointment", "payment", "system", "reminder"],
      required: true,
    },
    isRead: { type: Boolean, default: false },
    relatedId: { type: Schema.Types.ObjectId },
    relatedModel: { type: String, enum: ["Appointment", "Payment", "User"] },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema)