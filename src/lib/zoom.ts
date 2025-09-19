const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID || ""
const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID || ""
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET || ""
const ZOOM_BASE_URL = process.env.ZOOM_BASE_URL || ""
const ZOOM_AUTH_URL = process.env.ZOOM_AUTH_URL || ""

interface ZoomMeetingResponse {
  id: string
  join_url: string
  password: string
  start_url: string
}

export async function createZoomMeeting(topic: string, appointmentDate: Date, timeSlot: string, duration = 60): Promise<ZoomMeetingResponse> {
  const token = await getZoomAccessToken()

  // Parse time slot and create proper start time
  const [time, period] = timeSlot.split(' ')
  const [hours, minutes] = time.split(':')
  let hour24 = parseInt(hours)
  
  if (period === 'PM' && hour24 !== 12) hour24 += 12
  if (period === 'AM' && hour24 === 12) hour24 = 0
  
  const meetingStartTime = new Date(appointmentDate)
  meetingStartTime.setHours(hour24, parseInt(minutes), 0, 0)
  
  const meetingData = {
    topic,
    type: 2,
    start_time: meetingStartTime.toISOString(),
    duration,
    timezone: "UTC",
    settings: {
      host_video: true,
      participant_video: true,
      join_before_host: false, // Don't allow joining before host until meeting time
      mute_upon_entry: true,
      approval_type: 0,
      audio: "both",
      waiting_room: true, // Enable waiting room for security
    },
  }

  const response = await fetch(`${ZOOM_BASE_URL}/users/me/meetings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(meetingData),
  })

  if (!response.ok) {
    throw new Error("Failed to create Zoom meeting")
  }

  return response.json()
}

async function getZoomAccessToken(): Promise<string> {
  const credentials = Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64')
  
  const response = await fetch(ZOOM_AUTH_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'account_credentials',
      account_id: ZOOM_ACCOUNT_ID,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to get Zoom access token')
  }

  const data = await response.json()
  return data.access_token
}