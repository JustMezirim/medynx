"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { ProfileSection } from "@/components/admin/settings/profile-section"
import { SettingsGrid } from "@/components/admin/settings/settings-grid"
import { AdminManagement } from "@/components/admin/settings/admin-management"
import { SpecializationManagement } from "@/components/admin/settings/specialization-management"
import { AddAdminModal } from "@/components/admin/settings/add-admin-modal"
import { AddSpecializationModal } from "@/components/admin/settings/add-specialization-modal"
import { Save } from "lucide-react"
import { showToast } from "@/components/ui/toast-helper"
import { useSettings } from '@/hooks/admin/use-settings'
import { useSettingsHandlers } from '@/hooks/admin/use-settings-handlers'
import { useAdminProfile, useUpdateAdminProfile, useSpecializations, useAddSpecialization, useAddAdmin } from '@/hooks/admin/use-admin-settings'
import type { NewSpecialization as SpecializationData } from '@/lib/api/admin/admin-settings'

interface AppSettings {
  siteName: string
  contactEmail: string
  allowRegistration: boolean
  maintenanceMode: boolean
}

interface CurrentProfile {
  firstName: string
  lastName: string
  email: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface NewAdminForm {
  firstName: string
  lastName: string
  email: string
  permissions: string[]
}

const ADMIN_PERMISSIONS = [
  { id: 'users', label: 'Manage Users' },
  { id: 'doctors', label: 'Manage Doctors' },
  { id: 'patients', label: 'Manage Patients' },
  { id: 'appointments', label: 'Manage Appointments' },
  { id: 'payments', label: 'Manage Payments' },
  { id: 'reports', label: 'View Reports' },
  { id: 'analytics', label: 'View Analytics' },
  { id: 'settings', label: 'System Settings' },
  { id: 'backup', label: 'Data Backup' },
  { id: 'audit', label: 'Audit Logs' }
]

export default function AdminSettingsPage() {
  useSettings()
  const [settings, setSettings] = useState<AppSettings>({
    siteName: 'Medynx',
    contactEmail: "admin@Medynx.com",
    allowRegistration: true,
    maintenanceMode: false,
  })
  const { handleSave, handleChange, saving } = useSettingsHandlers(settings, setSettings)

  const [newAdmin, setNewAdmin] = useState<NewAdminForm>({
    firstName: "",
    lastName: "",
    email: "",
    permissions: []
  })
  const { data: profileData } = useAdminProfile()
  const [profile, setProfile] = useState<CurrentProfile>({
    firstName: profileData?.firstName || "Admin",
    lastName: profileData?.lastName || "User",
    email: profileData?.email || "admin@Medynx.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const addAdminMutation = useAddAdmin()
  const updateProfileMutation = useUpdateAdminProfile()
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const { data: specializations = [] } = useSpecializations()
  const [showAddSpecialization, setShowAddSpecialization] = useState(false)
  const [newSpecialization, setNewSpecialization] = useState<SpecializationData>({
    name: "",
    description: ""
  })
  const addSpecializationMutation = useAddSpecialization()

  const handleAddAdmin = async () => {
    if (!newAdmin.firstName || !newAdmin.lastName || !newAdmin.email || newAdmin.permissions.length === 0) {
      showToast.error('Please fill all fields and select permissions')
      return
    }

    try {
      await addAdminMutation.mutateAsync({
        ...newAdmin,
        password: newAdmin.firstName.toLowerCase() + '12345',
        role: 'admin'
      })
      setNewAdmin({ firstName: '', lastName: "", email: "", permissions: [] })
      setShowAddAdmin(false)
    } catch {
      // Error handled by mutation
    }
  }

  const handleUpdateProfile = async () => {
    if (profile.newPassword && profile.newPassword !== profile.confirmPassword) {
      showToast.error("New passwords don't match")
      return
    }

    try {
      await updateProfileMutation.mutateAsync(profile)
      setProfile(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }))
    } catch {
      // Error handled by mutation
    }
  }

  const togglePermission = (permissionId: string) => {
    setNewAdmin(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }))
  }

  const handleAddSpecialization = async () => {
    if (!newSpecialization.name || !newSpecialization.description) {
      showToast.error("Please fill all fields")
      return
    }

    try {
      await addSpecializationMutation.mutateAsync(newSpecialization)
      setNewSpecialization({ name: "", description: "" })
      setShowAddSpecialization(false)
    } catch {
      // Error handled by mutation
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Sidebar userRole="admin" userName="Admin User" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-10xl mx-auto space-y-8">
            <ProfileSection
              profile={profile}
              setProfile={setProfile}
              showPasswords={showPasswords}
              setShowPasswords={setShowPasswords}
              updatingProfile={updateProfileMutation.isPending}
              onUpdateProfile={handleUpdateProfile}
            />

            <SettingsGrid
              settings={settings}
              onSettingChange={handleChange}
            />

            <AdminManagement
              onAddAdmin={() => setShowAddAdmin(true)}
            />

            <SpecializationManagement
              specializations={specializations}
              onAddSpecialization={() => setShowAddSpecialization(true)}
            />

            <div className="flex justify-center pt-4">
              <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 text-base font-semibold shadow-lg">
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-3" />
                    Save All Settings
                  </>
                )}
              </Button>
            </div>
          </div>
        </main>
      </div>

      <AddAdminModal
        open={showAddAdmin}
        onOpenChange={setShowAddAdmin}
        newAdmin={newAdmin}
        setNewAdmin={setNewAdmin}
        addingAdmin={addAdminMutation.isPending}
        onAddAdmin={handleAddAdmin}
        togglePermission={togglePermission}
        permissions={ADMIN_PERMISSIONS}
      />

      <AddSpecializationModal
        open={showAddSpecialization}
        onOpenChange={setShowAddSpecialization}
        newSpecialization={newSpecialization}
        setNewSpecialization={setNewSpecialization}
        addingSpecialization={addSpecializationMutation.isPending}
        onAddSpecialization={handleAddSpecialization}
      />
    </div>
  )
}