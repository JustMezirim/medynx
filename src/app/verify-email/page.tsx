"use client"

import { useSearchParams } from 'next/navigation'
import { EmailVerification } from '@/components/auth/EmailVerification'
import { Suspense } from 'react'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <EmailVerification
        email={email}
        onVerified={() => {
          // Check if there's a redirect URL in localStorage or redirect to appropriate dashboard
          const user = JSON.parse(localStorage.getItem('pendingUser') || '{}')
          if (user.role) {
            localStorage.removeItem('pendingUser')
            // Force page reload to clear cache before redirect
            window.location.href = `/dashboard/${user.role}`
          } else {
            window.location.href = '/login'
          }
        }
      }
      //   onBack={() => {
      //     window.location.href = '/register'
      //   }
      // }
      />
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}