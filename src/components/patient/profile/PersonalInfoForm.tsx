import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Save, Shield, Mail, Phone, Calendar, MapPin } from "lucide-react"

interface PatientProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address: string
}

interface PersonalInfoFormProps {
  profile: PatientProfile
  saving: boolean
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export function PersonalInfoForm({ profile, saving, onSubmit }: PersonalInfoFormProps) {
  return (
    <Card className="border-0 shadow-lg h-fit">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <CardTitle className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <span>Personal Information</span>
        </CardTitle>
        <CardDescription>Update your personal details</CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">First Name</Label>
              <div className="relative">
                <Input id="firstName" name="firstName" defaultValue={profile.firstName} required className="pl-10 h-12" />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">Last Name</Label>
              <div className="relative">
                <Input id="lastName" name="lastName" defaultValue={profile.lastName} required className="pl-10 h-12" />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
            <div className="relative">
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={profile.email}
                disabled
                className="bg-gray-50 pl-10 h-12"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 flex items-center space-x-1">
              <Shield className="h-3 w-3" />
              <span>Email cannot be changed for security reasons</span>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">Phone Number</Label>
            <div className="relative">
              <Input id="phone" name="phone" type="tel" defaultValue={profile.phone} required className="pl-10 h-12" />
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-sm font-semibold text-gray-700">Date of Birth</Label>
              <div className="relative">
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  defaultValue={profile.dateOfBirth?.split("T")[0]}
                  required
                  className="pl-10 h-12"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-sm font-semibold text-gray-700">Gender</Label>
              <Select name="gender" defaultValue={profile.gender}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-semibold text-gray-700">Address</Label>
            <div className="relative">
              <Textarea id="address" name="address" rows={4} defaultValue={profile.address} required className="pl-10 pt-4 resize-none" />
              <MapPin className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <Button type="submit" disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-semibold">
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}