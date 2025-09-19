interface Doctor {
  _id: string
  firstName: string
  lastName: string
  email: string
  specialization: string
  experience: number
  consultationFee: number
  rating: number
  bio: string
  isVerified: boolean
  availability: Array<{
    day: string
    timeSlots: string[]
  }>
}

interface DoctorFilters {
  specialization?: string
  search?: string
  minRating?: number
  maxFee?: number
}

export const patientDoctorsApi = {
  getDoctors: async (filters?: DoctorFilters): Promise<Doctor[]> => {
    const params = new URLSearchParams()
    if (filters?.specialization) params.append('specialization', filters.specialization)
    if (filters?.search) params.append('search', filters.search)
    if (filters?.minRating) params.append('minRating', filters.minRating.toString())
    if (filters?.maxFee) params.append('maxFee', filters.maxFee.toString())

    const response = await fetch(`/api/patient/doctors?${params}`)
    if (!response.ok) throw new Error('Failed to fetch doctors')
    const data = await response.json()
    return data.doctors || []
  },

  getDoctor: async (id: string): Promise<Doctor> => {
    const response = await fetch(`/api/patient/doctors/${id}`)
    if (!response.ok) throw new Error('Failed to fetch doctor')
    const data = await response.json()
    return data.doctor
  },

  getDoctorAvailability: async (id: string, date: string): Promise<string[]> => {
    const response = await fetch(`/api/patient/doctors/${id}/availability?date=${date}`)
    if (!response.ok) throw new Error('Failed to fetch availability')
    const data = await response.json()
    return data.availableSlots || []
  }
}

export type { Doctor, DoctorFilters }