import connectDB from "@/lib/db"
import Appointment from "@/lib/models/Appointment"
import { addNotification, notifyAllAdmins } from "@/lib/notifications"

// Direct notification functions
async function createAppointmentNotifications(appointmentId: string) {
  await connectDB()
  const appointment = await Appointment.findById(appointmentId).populate("patient doctor")
  if (!appointment) return

  addNotification({
    recipient: appointment.doctor._id.toString(),
    title: "New Appointment Request",
    message: `New appointment request from ${appointment.patient.firstName} ${appointment.patient.lastName}`,
    type: "appointment",
    relatedId: appointmentId
  })

  addNotification({
    recipient: appointment.patient._id.toString(),
    title: "Appointment Booked",
    message: `Your appointment with Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName} has been booked`,
    type: "appointment",
    relatedId: appointmentId
  })

  await notifyAllAdmins({
    title: "New Appointment",
    message: `New appointment between ${appointment.patient.firstName} ${appointment.patient.lastName} and Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
    type: "appointment",
    relatedId: appointmentId
  })
}

async function createConfirmationNotifications(appointmentId: string) {
  await connectDB()
  const appointment = await Appointment.findById(appointmentId).populate("patient doctor")
  if (!appointment) return

  addNotification({
    recipient: appointment.patient._id.toString(),
    title: "Appointment Confirmed",
    message: `Your appointment with Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName} has been confirmed`,
    type: "appointment",
    relatedId: appointmentId
  })
}

async function createPaymentNotifications(appointmentId: string) {
  await connectDB()
  const appointment = await Appointment.findById(appointmentId).populate("patient doctor")
  if (!appointment) return

  addNotification({
    recipient: appointment.patient._id.toString(),
    title: "Payment Successful",
    message: `Payment for your appointment with Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName} was successful`,
    type: "payment",
    relatedId: appointmentId
  })

  addNotification({
    recipient: appointment.doctor._id.toString(),
    title: "Payment Received",
    message: `Payment received for appointment with ${appointment.patient.firstName} ${appointment.patient.lastName}`,
    type: "payment",
    relatedId: appointmentId
  })
}

// Webhook functions that call notification functions directly
export const webhooks = {
  appointmentCreated: (appointmentId: string) => createAppointmentNotifications(appointmentId),
  appointmentConfirmed: (appointmentId: string) => createConfirmationNotifications(appointmentId),
  paymentSuccessful: (appointmentId: string) => createPaymentNotifications(appointmentId),
  appointmentCancelled: async (appointmentId: string) => {
    await connectDB()
    const appointment = await Appointment.findById(appointmentId).populate("patient doctor")
    if (!appointment) return

    addNotification({
      recipient: appointment.patient._id.toString(),
      title: "Appointment Cancelled",
      message: `Your appointment with Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName} has been cancelled`,
      type: "appointment",
      relatedId: appointmentId
    })
  },
  appointmentReminder: async (appointmentId: string) => {
    await connectDB()
    const appointment = await Appointment.findById(appointmentId).populate("patient doctor")
    if (!appointment) return

    const appointmentDate = new Date(appointment.date).toLocaleDateString()
    
    addNotification({
      recipient: appointment.patient._id.toString(),
      title: "Appointment Reminder",
      message: `Reminder: You have an appointment with Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName} on ${appointmentDate} at ${appointment.timeSlot}`,
      type: "reminder",
      relatedId: appointmentId
    })
  }
}