import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings, Shield } from "lucide-react"

interface AppSettings {
  siteName: string
  contactEmail: string
  allowRegistration: boolean
  maintenanceMode: boolean
}

interface SettingsGridProps {
  settings: AppSettings
  onSettingChange: (field: keyof AppSettings, value: string | boolean) => void
}

export function SettingsGrid({ settings, onSettingChange }: SettingsGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
              onChange={(e) => onSettingChange("siteName", e.target.value)}
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
              onChange={(e) => onSettingChange("contactEmail", e.target.value)}
              placeholder="Enter contact email"
              className="h-11 border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20"
            />
          </div>
        </CardContent>
      </Card>

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
              onCheckedChange={(checked) => onSettingChange("allowRegistration", checked)}
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div>
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Maintenance Mode</Label>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Put site in maintenance mode</p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => onSettingChange("maintenanceMode", checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}