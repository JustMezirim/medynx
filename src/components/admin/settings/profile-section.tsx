import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Eye, EyeOff } from "lucide-react"

interface CurrentProfile {
  firstName: string
  lastName: string
  email: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface ProfileSectionProps {
  profile: CurrentProfile
  setProfile: (profile: CurrentProfile | ((prev: CurrentProfile) => CurrentProfile)) => void
  showPasswords: {
    current: boolean
    new: boolean
    confirm: boolean
  }
  setShowPasswords: (passwords: { current: boolean; new: boolean; confirm: boolean } | ((prev: { current: boolean; new: boolean; confirm: boolean }) => { current: boolean; new: boolean; confirm: boolean })) => void
  updatingProfile: boolean
  onUpdateProfile: () => void
}

export function ProfileSection({
  profile,
  setProfile,
  showPasswords,
  setShowPasswords,
  updatingProfile,
  onUpdateProfile
}: ProfileSectionProps) {
  return (
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
            <Button onClick={onUpdateProfile} disabled={updatingProfile} className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-11">
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
  )
}