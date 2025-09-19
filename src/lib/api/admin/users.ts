interface CreateUserData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  role: "doctor" | "patient"
  specialization?: string
  licenseNumber?: string
  experience?: number
  consultationFee?: number
  dateOfBirth?: string
  gender?: string
}

interface UpdateDoctorData {
  firstName: string
  lastName: string
  email: string
  phone: string
  specialization: string
  licenseNumber: string
  experience: number
  consultationFee: number
  bio?: string
}

interface UpdatePatientData {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address?: string
  emergencyContact?: string
}

export const adminUsersApi = {
  createUser: async (userData: CreateUserData): Promise<void> => {
    const response = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create user')
    }
  },

  updateDoctor: async (id: string, doctorData: UpdateDoctorData): Promise<void> => {
    const response = await fetch(`/api/admin/doctors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doctorData)
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update doctor')
    }
  },

  updatePatient: async (id: string, patientData: UpdatePatientData): Promise<void> => {
    const response = await fetch(`/api/admin/patients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData)
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update patient')
    }
  }
}

export type { CreateUserData, UpdateDoctorData, UpdatePatientData }