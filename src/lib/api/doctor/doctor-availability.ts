import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const doctorAvailabilityApi = {
  getAvailability: async () => {
    const { data } = await api.get('/availability/doctor')
    return data
  },

  getTimeSlots: async (date: Date, startHour: number = 9, endHour: number = 17) => {
    const { data } = await api.get('/time-slots', {
      params: { date: date.toISOString(), startHour, endHour }
    })
    return data
  },

  saveAvailability: async (availabilityData: { date: string; timeSlots: any[] }) => {
    const { data } = await api.post('/availability', availabilityData)
    return data
  },

  deleteAvailability: async (date: string) => {
    const { data } = await api.delete('/availability', { params: { date } })
    return data
  }
}