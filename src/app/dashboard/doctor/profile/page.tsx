"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { ProfileOverview } from "@/components/doctor/profile/profile-overview"
import { ProfessionalForm } from "@/components/doctor/profile/professional-form"
import { ProfileStats } from "@/components/doctor/profile/profile-stats"
import { LoadingSpinner } from "@/components/admin"
import { showToast } from "@/components/ui/toast-helper"

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

export default function DoctorProfilePage() {
  const [profile, setProfile] = useState<DoctorProfile | null>(null)
  const [stats, setStats] = useState({ totalPatients: 0, totalConsultations: 0 })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const [profileRes, statsRes] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/dashboard/stats")
      ])
      
      const profileData = await profileRes.json()
      const statsData = await statsRes.json()

      if (profileRes.ok) {
        const userData = profileData.user || profileData.profile || profileData
        setProfile(userData)
      } else {
        showToast.error(profileData.message || "Failed to load profile")
      }
      
      if (statsRes.ok) {
        setStats({
          totalPatients: statsData.totalPatients || 0,
          totalConsultations: statsData.completedAppointments || 0
        })
      }
    } catch (error) {
      console.error("Error fetching data:", error)
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
      specialization: formData.get("specialization"),
      licenseNumber: formData.get("licenseNumber"),
      experience: Number(formData.get("experience")),
      bio: formData.get("bio"),
      consultationFee: Number(formData.get("consultationFee")),
    }

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
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
    return <LoadingSpinner />
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="doctor" userName="Doctor" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="My Profile" subtitle="Manage your professional information and settings" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-10xl mx-auto space-y-6">
            {profile ? (
              <>
                <ProfileOverview profile={profile} />
                <ProfessionalForm profile={profile} onSubmit={handleSubmit} saving={saving} />
                <ProfileStats 
                  totalPatients={stats.totalPatients}
                  totalConsultations={stats.totalConsultations}
                  rating={profile.rating || 0}
                />
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
        </main>
      </div>
    </div>
  )
}
