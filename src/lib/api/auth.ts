interface Specialization {
  name: string
  description: string
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Login failed')
    }
    
    const data = await response.json()
    return {
      user: data.user,
      token: '' // Token is in httpOnly cookie, not needed in response
    }
  },

  register: async (formData: Record<string, unknown>): Promise<void> => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Registration failed')
    }
  },

  getProfile: async () => {
    const response = await fetch('/api/profile')
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch profile')
    }
    const data = await response.json()
    return data.profile
  },

  getSpecializations: async (): Promise<Specialization[]> => {
    const response = await fetch('/api/specializations')
    if (!response.ok) throw new Error('Failed to fetch specializations')
    const data = await response.json()
    return data.specializations || []
  }
}

interface LoginResponse {
  user: {
    userId: string
    email: string
    firstName: string
    lastName: string
    role: "patient" | "doctor" | "admin"
  }
  token?: string
}

export type { LoginResponse, Specialization }