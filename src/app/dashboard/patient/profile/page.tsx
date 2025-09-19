"use client"

import type React from "react"

import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { ProfileHeader } from "@/components/patient/profile/ProfileHeader"
import { PersonalInfoForm } from "@/components/patient/profile/PersonalInfoForm"
import { EmergencyContact } from "@/components/patient/profile/EmergencyContact"
import { MedicalInformation } from "@/components/patient/profile/MedicalInformation"
import { Button } from "@/components/ui/button"
import { usePatientProfile, useUpdatePatientProfile } from "@/hooks/patient/use-patient-profile"
import type { UpdateProfileData } from "@/lib/api/patient/profile"

export default function PatientProfilePage() {
  const { data: profile, isLoading } = usePatientProfile()
  const updateProfile = useUpdatePatientProfile()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const updatedProfile: UpdateProfileData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      phone: formData.get("phone") as string,
      dateOfBirth: formData.get("dateOfBirth") as string,
      gender: formData.get("gender") as string,
      address: formData.get("address") as string,
    }

    await updateProfile.mutateAsync(updatedProfile)
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
                    <Button type="submit" disabled={updateProfile.isPending}>
                      {updateProfile.isPending ? (
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
                <Button onClick={() => window.location.reload()} className="mt-4">
                  Retry
                </Button>
                </div>
              )}
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
