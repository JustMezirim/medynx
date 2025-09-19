import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Appointment from "@/lib/models/Appointment"
import { addNotification, notifyAllAdmins } from "@/lib/notifications"

export async function POST(request: NextRequest) {
  try {
    const { event, data } = await request.json()
    await connectDB()

    switch (event) {
      case "appointment.created":
        await createAppointmentNotifications(data.appointmentId)
        break
      case "appointment.confirmed":
        await createConfirmationNotifications(data.appointmentId)
        break
      case "appointment.cancelled":
        await createCancellationNotifications(data.appointmentId)
        break
      case "payment.successful":
        await createPaymentNotifications(data.appointmentId)
        break
      case "reminder.appointment":
        await createReminderNotifications(data.appointmentId)
        break
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}

async function createAppointmentNotifications(appointmentId: string) {
  const appointment = await Appointment.findById(appointmentId).populate("patient doctor")
  if (!appointment) return

  // Notify doctor
  addNotification({
    recipient: appointment.doctor._id,
    title: "New Appointment Request",
    message: `New appointment request from ${appointment.patient.firstName} ${appointment.patient.lastName}`,
    type: "appointment",
    relatedId: appointmentId
  })

  // Notify patient
  addNotification({
    recipient: appointment.patient._id,
    title: "Appointment Booked",
    message: `Your appointment with Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName} has been booked`,
    type: "appointment",
    relatedId: appointmentId
  })

  // Notify admins
  notifyAllAdmins({
    title: "New Appointment",
    message: `New appointment between ${appointment.patient.firstName} ${appointment.patient.lastName} and Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
    type: "appointment",
    relatedId: appointmentId
  })
}

async function createConfirmationNotifications(appointmentId: string) {
  const appointment = await Appointment.findById(appointmentId).populate("patient doctor")
  if (!appointment) return

  addNotification({
    recipient: appointment.patient._id,
    title: "Appointment Confirmed",
    message: `Your appointment with Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName} has been confirmed`,
    type: "appointment",
    relatedId: appointmentId
  })
}

async function createCancellationNotifications(appointmentId: string) {
  const appointment = await Appointment.findById(appointmentId).populate("patient doctor")
  if (!appointment) return

  addNotification({
    recipient: appointment.patient._id,
    title: "Appointment Cancelled",
    message: `Your appointment with Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName} has been cancelled`,
    type: "appointment",
    relatedId: appointmentId
  })

  addNotification({
    recipient: appointment.doctor._id,
    title: "Appointment Cancelled",
    message: `Appointment with ${appointment.patient.firstName} ${appointment.patient.lastName} has been cancelled`,
    type: "appointment",
    relatedId: appointmentId
  })
}

async function createPaymentNotifications(appointmentId: string) {
  const appointment = await Appointment.findById(appointmentId).populate("patient doctor")
  if (!appointment) return

  addNotification({
    recipient: appointment.patient._id,
    title: "Payment Successful",
    message: `Payment for your appointment with Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName} was successful`,
    type: "payment",
    relatedId: appointmentId
  })

  addNotification({
    recipient: appointment.doctor._id,
    title: "Payment Received",
    message: `Payment received for appointment with ${appointment.patient.firstName} ${appointment.patient.lastName}`,
    type: "payment",
    relatedId: appointmentId
  })

  // Notify admins about payment
  notifyAllAdmins({
    title: "Payment Processed",
    message: `Payment of ₦${appointment.amount} processed for appointment ${appointmentId}`,
    type: "payment",
    relatedId: appointmentId
  })
}

async function createReminderNotifications(appointmentId: string) {
  const appointment = await Appointment.findById(appointmentId).populate("patient doctor")
  if (!appointment) return

  const appointmentDate = new Date(appointment.date).toLocaleDateString()
  
  addNotification({
    recipient: appointment.patient._id,
    title: "Appointment Reminder",
    message: `Reminder: You have an appointment with Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName} on ${appointmentDate} at ${appointment.timeSlot}`,
    type: "reminder",
    relatedId: appointmentId
  })

  addNotification({
    recipient: appointment.doctor._id,
    title: "Appointment Reminder",
    message: `Reminder: You have an appointment with ${appointment.patient.firstName} ${appointment.patient.lastName} on ${appointmentDate} at ${appointment.timeSlot}`,
    type: "reminder",
    relatedId: appointmentId
  })
}