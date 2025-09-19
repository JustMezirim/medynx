"use client"

import type React from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { ProfileOverview } from "@/components/doctor/profile/profile-overview"
import { ProfessionalForm } from "@/components/doctor/profile/professional-form"
import { ProfileStats } from "@/components/doctor/profile/profile-stats"
import { LoadingSpinner } from "@/components/admin"
import { useDoctorProfile, useDoctorStats, useUpdateProfile } from "@/hooks/doctor/use-doctor-profile"

export default function DoctorProfilePage() {
  const { data: profile, isLoading: profileLoading } = useDoctorProfile()
  const { data: stats } = useDoctorStats()
  const updateMutation = useUpdateProfile()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const updatedProfile = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      phone: formData.get("phone") as string,
      specialization: formData.get("specialization") as string,
      licenseNumber: formData.get("licenseNumber") as string,
      experience: Number(formData.get("experience")),
      bio: formData.get("bio") as string,
      consultationFee: Number(formData.get("consultationFee")),
    }

    updateMutation.mutate(updatedProfile)
  }

  if (profileLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="doctor" userName="Doctor" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader  />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-10xl mx-auto space-y-6">
            {profile ? (
              <>
                <ProfileOverview profile={profile} />
                <ProfessionalForm profile={profile} onSubmit={handleSubmit} saving={updateMutation.isPending} />
                <ProfileStats 
                  totalPatients={stats?.totalPatients || 0}
                  totalConsultations={stats?.totalConsultations || 0}
                  rating={profile.rating || 0}
                />
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No profile data available. Please try refreshing the page.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
