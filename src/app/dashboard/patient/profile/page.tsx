"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { ProfileHeader } from "@/components/patient/profile/ProfileHeader"
import { PersonalInfoForm } from "@/components/patient/profile/PersonalInfoForm"
import { EmergencyContact } from "@/components/patient/profile/EmergencyContact"
import { MedicalInformation } from "@/components/patient/profile/MedicalInformation"
import { showToast } from "@/components/ui/toast-helper"
import { LoadingSpinner } from "@/components/admin"

interface PatientProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address: string
}

export default function PatientProfilePage() {
  const [profile, setProfile] = useState<PatientProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile")
      const data = await response.json()

      if (response.ok) {
        setProfile(data.profile)
      } else {
        showToast.error("Failed to load profile")
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      showToast.error("Failed to load profile")
    } finally {
      setLoading(false)
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

  if (loading) {
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
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Sidebar userRole="patient" userName="John Doe" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="My Profile" subtitle="Manage your personal information and preferences" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-10xl mx-auto">
            <div className="mb-8">
              <ProfileHeader firstName={profile?.firstName} lastName={profile?.lastName} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              <div className="xl:col-span-3">
                {profile && (
                  <PersonalInfoForm 
                    profile={profile} 
                    saving={saving} 
                    onSubmit={handleSubmit} 
                  />
                )}
              </div>

              <div className="xl:col-span-1 space-y-6">
                <EmergencyContact />
                <MedicalInformation />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
