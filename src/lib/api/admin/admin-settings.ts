interface AdminProfile {
  firstName: string
  lastName: string
  email: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface NewAdmin {
  firstName: string
  lastName: string
  email: string
  permissions: string[]
  password: string
  role: string
}

interface NewSpecialization {
  name: string
  description: string
}

export const adminSettingsApi = {
  getProfile: async () => {
    const response = await fetch('/api/profile')
    if (!response.ok) throw new Error('Failed to fetch profile')
    const data = await response.json()
    return data.user || data.profile || data
  },

  updateProfile: async (profile: AdminProfile) => {
    const response = await fetch('/api/admin/profile', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(profile)
    })
    if (!response.ok) throw new Error('Failed to update profile')
    return response.json()
  },

  getSpecializations: async () => {
    const response = await fetch('/api/admin/specializations')
    if (!response.ok) throw new Error('Failed to fetch specializations')
    const data = await response.json()
    return data.specializations || []
  },

  addSpecialization: async (specialization: NewSpecialization) => {
    const response = await fetch('/api/admin/specializations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(specialization)
    })
    if (!response.ok) throw new Error('Failed to add specialization')
    return response.json()
  },

  addAdmin: async (admin: NewAdmin) => {
    const response = await fetch('/api/admin/create-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(admin)
    })
    if (!response.ok) throw new Error('Failed to add admin')
    return response.json()
  }
}

export type { AdminProfile, NewAdmin, NewSpecialization }