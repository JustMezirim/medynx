"use client"

import type React from "react"

import { useState  } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { ProfileHeader } from "@/components/patient/profile/ProfileHeader"
import { PersonalInfoForm } from "@/components/patient/profile/PersonalInfoForm"
import { EmergencyContact } from "@/components/patient/profile/EmergencyContact"
import { MedicalInformation } from "@/components/patient/profile/MedicalInformation"
import { showToast } from "@/components/ui/toast-helper"
import { Button } from "@/components/ui/button"

interface PatientProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth?: string
  gender?: string
  address?: string
}

export default function PatientProfilePage() {
  const [profile, setProfile] = useState<PatientProfile | null>(null)
  
  const [saving, setSaving] = useState(false)

  // Replaced with React Query

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile")
      const data = await response.json()

      if (response.ok) {
        console.log('Profile data:', data.profile)
        setProfile(data.profile)
      } else {
        showToast.error("Failed to load profile")
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      showToast.error("Failed to load profile")
    } finally {
      // Loading handled by React Query
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    const formData = new FormData(e.currentTarget)
    const updatedProfile = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      phone: formData.get("phone"),
      dateOfBirth: formData.get("dateOfBirth"),
      gender: formData.get("gender"),
      address: formData.get("address"),
    }

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfile),
      })

      if (response.ok) {
        showToast.success("Profile updated successfully")
        fetchProfile()
      } else {
        const data = await response.json()
        showToast.error(data.message || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      showToast.error("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar userRole="patient" userName="John Doe" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
      // <LoadingSpinner />
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="patient" userName="John Doe" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit}>
            <div className="max-w-10xl mx-auto space-y-6">
              {profile ? (
                <>
                  <ProfileHeader firstName={profile?.firstName} lastName={profile?.lastName} />
                  <PersonalInfoForm profile={profile} />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <MedicalInformation />
                    <EmergencyContact />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={saving}>
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        "Save All Changes"
                      )}
                    </Button>
                  </div>
                </>
              ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No profile data available. Please try refreshing the page.</p>
                <button onClick={fetchProfile} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                  Retry
                </button>
                </div>
              )}
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
