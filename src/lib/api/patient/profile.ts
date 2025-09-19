interface PatientProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth?: string
  gender?: string
  address?: string
}

interface UpdateProfileData {
  firstName?: string
  lastName?: string
  phone?: string
  dateOfBirth?: string
  gender?: string
  address?: string
}

export const patientProfileApi = {
  getProfile: async (): Promise<PatientProfile> => {
    const response = await fetch('/api/profile')
    if (!response.ok) throw new Error('Failed to fetch profile')
    const data = await response.json()
    return data.profile
  },

  updateProfile: async (profileData: UpdateProfileData): Promise<PatientProfile> => {
    const response = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    })
    if (!response.ok) throw new Error('Failed to update profile')
    const data = await response.json()
    return data.profile
  }
}

export type { PatientProfile, UpdateProfileData }