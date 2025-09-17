import { useState } from 'react'
import { showToast } from '@/components/ui/toast-helper'
import { useUpdateSettings } from './use-settings'

interface AppSettings {
  siteName: string
  contactEmail: string
  allowRegistration: boolean
  maintenanceMode: boolean
}

export const useSettingsHandlers = (settings: AppSettings, setSettings: (settings: AppSettings) => void) => {
  const [saving, setSaving] = useState(false)
  const updateSettings = useUpdateSettings()

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateSettings.mutateAsync(settings)
      showToast.success('Settings saved successfully')
    } catch (error) {
      console.error('Save error:', error)
      showToast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: keyof AppSettings, value: string | boolean) => {
    const newSettings = { ...settings, [field]: value }
    setSettings(newSettings)
    
    if (field === 'maintenanceMode' || field === 'allowRegistration') {
      setTimeout(async () => {
        try {
          await updateSettings.mutateAsync(newSettings)
          showToast.success(`${field === 'maintenanceMode' ? 'Maintenance mode' : 'Registration'} updated`)
        } catch (error) {
          console.error('Auto-save error:', error)
          showToast.error('Failed to save setting')
        }
      }, 100)
    }
  }

  return { handleSave, handleChange, saving }
}