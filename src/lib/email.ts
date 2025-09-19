import nodemailer from "nodemailer"
import { emailTemplates } from "./email-templates"

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    console.log("Sending email to:", to)
    const result = await transport.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
    })
    console.log("Email sent successfully:", result.messageId)
    return result
  } catch (error) {
    console.error("Email sending failed:", error)
    throw error
  }
}

// Helper functions using centralized templates
export async function sendWelcomeEmail(to: string, firstName: string, lastName: string) {
  const template = emailTemplates.patientWelcome(firstName, lastName)
  return sendEmail({ to, subject: template.subject, html: template.html })
}

export async function sendDoctorRegistrationEmail(to: string, firstName: string, lastName: string, specialization: string, licenseNumber: string, experience: number) {
  const template = emailTemplates.doctorRegistration(firstName, lastName, specialization, licenseNumber, experience)
  return sendEmail({ to, subject: template.subject, html: template.html })
}

export async function sendDoctorApprovalEmail(to: string, firstName: string, lastName: string) {
  const template = emailTemplates.doctorApproval(firstName, lastName)
  return sendEmail({ to, subject: template.subject, html: template.html })
}

export async function sendAppointmentConfirmationEmail(to: string, patientName: string, doctorName: string, date: string, time: string) {
  const template = emailTemplates.appointmentConfirmation(patientName, doctorName, date, time)
  return sendEmail({ to, subject: template.subject, html: template.html })
}



export async function sendPasswordResetEmail(to: string, firstName: string, resetLink: string) {
  const template = emailTemplates.passwordReset(firstName, resetLink)
  return sendEmail({ to, subject: template.subject, html: template.html })
}

export async function sendDoctorDeactivationEmail(to: string, firstName: string, lastName: string) {
  const template = emailTemplates.doctorDeactivation(firstName, lastName)
  return sendEmail({ to, subject: template.subject, html: template.html })
}

export async function sendDoctorVerificationEmail(to: string, firstName: string, lastName: string) {
  const template = emailTemplates.doctorVerification(firstName, lastName)
  return sendEmail({ to, subject: template.subject, html: template.html })
}

export async function sendDoctorUnverificationEmail(to: string, firstName: string, lastName: string) {
  const template = emailTemplates.doctorUnverification(firstName, lastName)
  return sendEmail({ to, subject: template.subject, html: template.html })
}

export async function sendAppointmentCancellationEmail(to: string, patientName: string, doctorName: string, date: string, timeSlot: string, amount: number) {
  const template = emailTemplates.appointmentCancellation(patientName, doctorName, date, timeSlot, amount)
  return sendEmail({ to, subject: template.subject, html: template.html })
}

export async function sendAppointmentConfirmedPatientEmail(to: string, patientName: string, doctorName: string, date: string, timeSlot: string, type: string) {
  const template = emailTemplates.appointmentConfirmedPatient(patientName, doctorName, date, timeSlot, type)
  return sendEmail({ to, subject: template.subject, html: template.html })
}

export async function sendAppointmentBookedDoctorEmail(to: string, doctorName: string, patientName: string, date: string, timeSlot: string, type: string) {
  const template = emailTemplates.appointmentBookedDoctor(doctorName, patientName, date, timeSlot, type)
  return sendEmail({ to, subject: template.subject, html: template.html })
}

export async function sendMeetingLinkPatientEmail(to: string, patientName: string, meetingLink: string, password: string, date: string, timeSlot: string) {
  const template = emailTemplates.meetingLinkPatient(patientName, meetingLink, password, date, timeSlot)
  return sendEmail({ to, subject: template.subject, html: template.html })
}

export async function sendMeetingLinkDoctorEmail(to: string, doctorName: string, patientName: string, meetingLink: string, password: string, date: string, timeSlot: string) {
  const template = emailTemplates.meetingLinkDoctor(doctorName, patientName, meetingLink, password, date, timeSlot)
  return sendEmail({ to, subject: template.subject, html: template.html })
}

export async function sendDoctorReactivationEmail(to: string, firstName: string, lastName: string) {
  const template = emailTemplates.doctorReactivation(firstName, lastName)
  return sendEmail({ to, subject: template.subject, html: template.html })
}

export async function sendAppointmentReminderEmail(
  to: string,
  recipientName: string,
  otherPartyName: string,
  appointmentDate: string,
  appointmentTime: string,
  meetingLink: string,
  reminderTime: string
) {
  const template = emailTemplates.appointmentReminderCustom(recipientName, otherPartyName, appointmentDate, appointmentTime, meetingLink, reminderTime)
  return sendEmail({ to, subject: template.subject, html: template.html })
}

export async function sendOTPEmail(to: string, otp: string, type: 'verification' | 'reset' = 'verification') {
  const template = type === 'verification' 
    ? emailTemplates.emailVerification(otp)
    : emailTemplates.passwordResetOTP(otp)
  return sendEmail({ to, subject: template.subject, html: template.html })
}

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}