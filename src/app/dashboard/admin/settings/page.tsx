"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Save, Settings, Shield, UserPlus, User, Eye, EyeOff, Stethoscope, Plus } from "lucide-react"
import { showToast } from "@/components/ui/toast-helper"

interface AppSettings {
  siteName: string
  contactEmail: string
  allowRegistration: boolean
  maintenanceMode: boolean
}

interface NewAdmin {
  firstName: string
  lastName: string
  email: string
  permissions: string[]
}

interface CurrentProfile {
  firstName: string
  lastName: string
  email: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface Specialization {
  _id: string
  name: string
  description: string
  isActive: boolean
  createdAt: string
}

interface NewSpecialization {
  name: string
  description: string
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
  const [settings, setSettings] = useState<AppSettings>({
    siteName: 'Medynx',
    contactEmail: "admin@Medynx.com",
    allowRegistration: true,
    maintenanceMode: false,
  })
  const [newAdmin, setNewAdmin] = useState<NewAdmin>({
    firstName: "",
    lastName: "",
    email: "",
    permissions: []
  })
  const [profile, setProfile] = useState<CurrentProfile>({
    firstName: "Admin",
    lastName: "User",
    email: "admin@Medynx.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [saving, setSaving] = useState(false)
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [addingAdmin, setAddingAdmin] = useState(false)
  const [updatingProfile, setUpdatingProfile] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [specializations, setSpecializations] = useState<Specialization[]>([])
  const [showAddSpecialization, setShowAddSpecialization] = useState(false)
  const [newSpecialization, setNewSpecialization] = useState<NewSpecialization>({
    name: "",
    description: ""
  })
  const [addingSpecialization, setAddingSpecialization] = useState(false)

  useEffect(() => {
    fetchSettings()
    fetchSpecializations()
  }, [])

  const fetchSpecializations = async () => {
    try {
      const response = await fetch('/api/admin/specializations')
      if (response.ok) {
        const data = await response.json()
        setSpecializations(data.specializations)
      }
    } catch (error) {
      console.error('Failed to fetch specializations:', error)
    }
  }

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token')
      
      // Fetch settings
      const settingsResponse = await fetch('/api/admin/settings')
      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json()
        if (settingsData.settings) {
          console.log('Loaded settings from DB:', settingsData.settings)
          const dbSettings = settingsData.settings
          setSettings({
            siteName: dbSettings.siteName || 'Medynx',
            contactEmail: dbSettings.contactEmail || "admin@Medynx.com",
            allowRegistration: Boolean(dbSettings.allowRegistration),
            maintenanceMode: Boolean(dbSettings.maintenanceMode)
          })
          console.log('Set frontend state to:', {
            siteName: dbSettings.siteName || 'Medynx',
            contactEmail: dbSettings.contactEmail || "admin@Medynx.com",
            allowRegistration: Boolean(dbSettings.allowRegistration),
            maintenanceMode: Boolean(dbSettings.maintenanceMode)
          })
        }
      }
      
      // Fetch profile
      const profileResponse = await fetch('/api/admin/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        if (profileData.profile) {
          setProfile(prev => ({
            ...prev,
            firstName: profileData.profile.firstName,
            lastName: profileData.profile.lastName,
            email: profileData.profile.email
          }))
        }
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
      // Keep default values if API fails
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      console.log('Saving settings:', settings)
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      const data = await response.json()
      console.log('Save response:', data)
      
      if (response.ok) {
        showToast.success('Settings saved successfully')
        // Refresh settings after save
        await fetchSettings()
      } else {
        showToast.error(data.message || "Failed to save settings")
      }
    } catch (error) {
      console.error('Save error:', error)
      showToast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: keyof AppSettings, value: string | boolean) => {
    console.log('Changing setting:', field, 'to:', value)
    const newSettings = { ...settings, [field]: value }
    console.log('New settings state:', newSettings)
    setSettings(newSettings)
    
    // Auto-save when maintenance mode or registration changes
    if (field === 'maintenanceMode' || field === 'allowRegistration') {
      setTimeout(async () => {
        try {
          const response = await fetch('/api/admin/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSettings)
          })
          if (response.ok) {
            showToast.success(`${field === 'maintenanceMode' ? 'Maintenance mode' : 'Registration'} updated`)
          }
        } catch (error) {
          console.error('Auto-save error:', error)
          showToast.error('Failed to save setting')
        }
      }, 100)
    }
  }

  const handleAddAdmin = async () => {
    if (!newAdmin.firstName || !newAdmin.lastName || !newAdmin.email || newAdmin.permissions.length === 0) {
      showToast.error('Please fill all fields and select permissions')
      return
    }

    setAddingAdmin(true)
    try {
      const adminData = {
        ...newAdmin,
        password: newAdmin.firstName.toLowerCase() + '12345',
        role: 'admin'
      }
      
      const response = await fetch('/api/admin/create-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminData)
      })
      
      if (response.ok) {
        showToast.success(`Admin added successfully. Default password: ${newAdmin.firstName.toLowerCase()}12345`)
        setNewAdmin({ firstName: '', lastName: "", email: "", permissions: [] })
        setShowAddAdmin(false)
      } else {
        showToast.error("Failed to add admin")
      }
    } catch (error) {
      showToast.error("Failed to add admin")
    } finally {
      setAddingAdmin(false)
    }
  }

  const handleUpdateProfile = async () => {
    if (profile.newPassword && profile.newPassword !== profile.confirmPassword) {
      showToast.error("New passwords don't match")
      return
    }

    setUpdatingProfile(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      })
      
      if (response.ok) {
        showToast.success('Profile updated successfully')
        setProfile(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }))
      } else {
        showToast.error("Failed to update profile")
      }
    } catch (error) {
      showToast.error("Failed to update profile")
    } finally {
      setUpdatingProfile(false)
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

    setAddingSpecialization(true)
    try {
      const response = await fetch('/api/admin/specializations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSpecialization)
      })
      
      if (response.ok) {
        showToast.success('Specialization added successfully')
        setNewSpecialization({ name: "", description: "" })
        setShowAddSpecialization(false)
        fetchSpecializations()
      } else {
        const error = await response.json()
        showToast.error(error.message || "Failed to add specialization")
      }
    } catch (error) {
      showToast.error("Failed to add specialization")
    } finally {
      setAddingSpecialization(false)
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Sidebar userRole="admin" userName="Admin User" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          title="Settings" 
          subtitle="Manage system configuration" 
        />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-10xl mx-auto space-y-8">
            {/* Profile Section */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl"></div>
              <Card className="relative border-0 shadow-2xl bg-white/95 backdrop-blur-md dark:bg-slate-800/95 rounded-3xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl text-white">
                      <User className="h-5 w-5" />
                    </div>
                    Current Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="profileFirstName" className="text-sm font-semibold text-slate-700 dark:text-slate-300">First Name</Label>
                      <Input
                        id="profileFirstName"
                        value={profile.firstName}
                        onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="Enter first name"
                        className="h-11 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileLastName" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Last Name</Label>
                      <Input
                        id="profileLastName"
                        value={profile.lastName}
                        onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Enter last name"
                        className="h-11 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profileEmail" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</Label>
                    <Input
                      id="profileEmail"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address"
                      className="h-11 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="border-t pt-6">
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Change Password</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="text-sm font-medium text-slate-600 dark:text-slate-400">Current</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showPasswords.current ? "text" : "password"}
                            value={profile.currentPassword}
                            onChange={(e) => setProfile(prev => ({ ...prev, currentPassword: e.target.value }))}
                            placeholder="Current password"
                            className="h-11 border-slate-200 dark:border-slate-700 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                          >
                            {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-sm font-medium text-slate-600 dark:text-slate-400">New</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showPasswords.new ? "text" : "password"}
                            value={profile.newPassword}
                            onChange={(e) => setProfile(prev => ({ ...prev, newPassword: e.target.value }))}
                            placeholder="New password"
                            className="h-11 border-slate-200 dark:border-slate-700 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                          >
                            {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-600 dark:text-slate-400">Confirm</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showPasswords.confirm ? "text" : "password"}
                            value={profile.confirmPassword}
                            onChange={(e) => setProfile(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            placeholder="Confirm password"
                            className="h-11 border-slate-200 dark:border-slate-700 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                          >
                            {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button onClick={handleUpdateProfile} disabled={updatingProfile} className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-11">
                      {updatingProfile ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        "Update Profile"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* General Settings */}
              <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-md dark:bg-slate-800/95 rounded-2xl">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl text-white">
                      <Settings className="h-5 w-5" />
                    </div>
                    Platform Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="siteName" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Site Name</Label>
                    <Input
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) => handleChange("siteName", e.target.value)}
                      placeholder="Enter site name"
                      className="h-11 border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => handleChange("contactEmail", e.target.value)}
                      placeholder="Enter contact email"
                      className="h-11 border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* System Controls */}
              <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-md dark:bg-slate-800/95 rounded-2xl">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl text-white">
                      <Shield className="h-5 w-5" />
                    </div>
                    System Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <div>
                      <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">User Registration</Label>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Allow new users to register</p>
                    </div>
                    <Switch
                      checked={settings.allowRegistration}
                      onCheckedChange={(checked) => handleChange("allowRegistration", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <div>
                      <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Maintenance Mode</Label>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Put site in maintenance mode</p>
                    </div>
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) => handleChange("maintenanceMode", checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Admin Management */}
            <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-md dark:bg-slate-800/95 rounded-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl text-white">
                      <UserPlus className="h-5 w-5" />
                    </div>
                    Admin Management
                  </div>
                  <Button onClick={() => setShowAddAdmin(true)} className="bg-violet-600 hover:bg-violet-700 text-white px-4 h-10">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Admin
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Create new administrator accounts with granular permissions to manage different aspects of the system.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Specialization Management */}
            <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-md dark:bg-slate-800/95 rounded-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl text-white">
                      <Stethoscope className="h-5 w-5" />
                    </div>
                    Medical Specializations
                  </div>
                  <Button onClick={() => setShowAddSpecialization(true)} className="bg-teal-600 hover:bg-teal-700 text-white px-4 h-10">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Specialization
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Manage medical specializations available for doctors to select during registration.
                    </p>
                  </div>
                  {specializations.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                      {specializations.map((spec) => (
                        <div key={spec._id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300 capitalize">{spec.name}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{spec.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
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

      <Dialog open={showAddAdmin} onOpenChange={setShowAddAdmin}>
        <DialogContent className="border-0 shadow-2xl bg-white/95 backdrop-blur-md dark:bg-slate-800/95 rounded-2xl max-w-2xl">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Add New Administrator
            </DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400">
              Create a new administrator account with specific permissions. Default password will be <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1 rounded">firstname + 12345</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-semibold text-slate-700 dark:text-slate-300">First Name</Label>
                <Input
                  id="firstName"
                  value={newAdmin.firstName}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Enter first name"
                  className="h-11 border-slate-200 dark:border-slate-700 focus:border-violet-500 focus:ring-violet-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Last Name</Label>
                <Input
                  id="lastName"
                  value={newAdmin.lastName}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Enter last name"
                  className="h-11 border-slate-200 dark:border-slate-700 focus:border-violet-500 focus:ring-violet-500/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
                className="h-11 border-slate-200 dark:border-slate-700 focus:border-violet-500 focus:ring-violet-500/20"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Permissions</Label>
              <div className="grid grid-cols-2 gap-3 max-h-56 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                {ADMIN_PERMISSIONS.map(permission => (
                  <div key={permission.id} className="flex items-center space-x-3 p-2 hover:bg-white dark:hover:bg-slate-600 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      id={permission.id}
                      checked={newAdmin.permissions.includes(permission.id)}
                      onChange={() => togglePermission(permission.id)}
                      className="w-4 h-4 text-violet-600 border-slate-300 rounded focus:ring-violet-500 focus:ring-2"
                    />
                    <Label htmlFor={permission.id} className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                      {permission.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            {newAdmin.firstName && newAdmin.firstName.trim() && (
              <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl border border-violet-200 dark:border-violet-800">
                <p className="text-sm text-violet-700 dark:text-violet-300">
                  🔑 Default password will be: <span className="font-mono font-bold bg-violet-100 dark:bg-violet-800 px-2 py-1 rounded">{newAdmin.firstName.toLowerCase()}12345</span>
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="pt-6">
            <Button variant="outline" onClick={() => setShowAddAdmin(false)} className="px-6">
              Cancel
            </Button>
            <Button onClick={handleAddAdmin} disabled={addingAdmin} className="bg-violet-600 hover:bg-violet-700 text-white px-6">
              {addingAdmin ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                "Create Admin"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddSpecialization} onOpenChange={setShowAddSpecialization}>
        <DialogContent className="border-0 shadow-2xl bg-white/95 backdrop-blur-md dark:bg-slate-800/95 rounded-2xl max-w-md">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Add New Specialization
            </DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400">
              Add a new medical specialization for doctors to select.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="specName" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Specialization Name</Label>
              <Input
                id="specName"
                value={newSpecialization.name}
                onChange={(e) => setNewSpecialization(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Cardiology, Dermatology"
                className="h-11 border-slate-200 dark:border-slate-700 focus:border-teal-500 focus:ring-teal-500/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specDescription" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description</Label>
              <Input
                id="specDescription"
                value={newSpecialization.description}
                onChange={(e) => setNewSpecialization(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the specialization"
                className="h-11 border-slate-200 dark:border-slate-700 focus:border-teal-500 focus:ring-teal-500/20"
              />
            </div>
          </div>
          <DialogFooter className="pt-6">
            <Button variant="outline" onClick={() => setShowAddSpecialization(false)} className="px-6">
              Cancel
            </Button>
            <Button onClick={handleAddSpecialization} disabled={addingSpecialization} className="bg-teal-600 hover:bg-teal-700 text-white px-6">
              {addingSpecialization ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                "Add Specialization"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
               
