export async function triggerNotificationWebhook(event: string, data: any) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event, data }),
    })

    if (!response.ok) {
      console.error('Webhook failed:', await response.text())
    }
  } catch (error) {
    console.error('Webhook error:', error)
  }
}

export const NotificationEvents = {
  APPOINTMENT_CREATED: 'appointment.created',
  APPOINTMENT_CONFIRMED: 'appointment.confirmed',
  APPOINTMENT_CANCELLED: 'appointment.cancelled',
  PAYMENT_SUCCESSFUL: 'payment.successful',
  REMINDER_APPOINTMENT: 'reminder.appointment',
} as const