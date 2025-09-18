interface DoctorProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  specialization: string
  licenseNumber: string
  experience: number
  bio: string
  consultationFee: number
  rating: number
  isVerified: boolean
}

interface ProfileStats {
  totalPatients: number
  totalConsultations: number
}

interface UpdateProfileData {
  firstName: string
  lastName: string
  phone: string
  specialization: string
  licenseNumber: string
  experience: number
  bio: string
  consultationFee: number
}

export const doctorProfileApi = {
  getProfile: async (): Promise<DoctorProfile> => {
    const response = await fetch("/api/profile")
    if (!response.ok) throw new Error("Failed to fetch profile")
    const data = await response.json()
    return data.user || data.profile || data
  },

  getStats: async (): Promise<ProfileStats> => {
    const response = await fetch("/api/dashboard/stats")
    if (!response.ok) throw new Error("Failed to fetch stats")
    const data = await response.json()
    return {
      totalPatients: data.totalPatients || 0,
      totalConsultations: data.completedAppointments || 0,
    }
  },

  updateProfile: async (profileData: UpdateProfileData): Promise<DoctorProfile> => {
    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    })
    if (!response.ok) throw new Error("Failed to update profile")
    return response.json()
  },
}

export type { DoctorProfile, ProfileStats, UpdateProfileData }