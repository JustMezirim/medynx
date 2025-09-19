export const verifyOTP = async ({ email, otp }: { email: string; otp: string }) => {
  const response = await fetch('/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp, type: 'email_verification' })
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Verification failed')
  }
  
  return response.json()
}

export const sendOTP = async (email: string) => {
  const response = await fetch('/api/auth/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, type: 'email_verification' })
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to send OTP')
  }
  
  return response.json()
}

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Login failed')
    }
    
    return response.json()
  },
  
  register: async (formData: Record<string, unknown>) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Registration failed')
    }
    
    return response.json()
  },
  
  getProfile: async () => {
    const response = await fetch('/api/auth/me')
    
    if (!response.ok) {
      throw new Error('Failed to get profile')
    }
    
    return response.json()
  },
  
  getSpecializations: async () => {
    const response = await fetch('/api/specializations')
    
    if (!response.ok) {
      throw new Error('Failed to get specializations')
    }
    
    return response.json()
  }
}