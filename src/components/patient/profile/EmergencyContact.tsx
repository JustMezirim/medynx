import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone, Save } from "lucide-react"

export function EmergencyContact() {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 border-b">
        <CardTitle className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <Phone className="h-5 w-5 text-red-600" />
          </div>
          <span>Emergency Contact</span>
        </CardTitle>
        <CardDescription>Important contact for emergencies</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="emergencyName" className="text-sm font-semibold text-gray-700">Contact Name</Label>
            <Input id="emergencyName" placeholder="Full name" className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergencyPhone" className="text-sm font-semibold text-gray-700">Phone Number</Label>
            <Input id="emergencyPhone" type="tel" placeholder="Phone number" className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergencyRelation" className="text-sm font-semibold text-gray-700">Relationship</Label>
            <Input id="emergencyRelation" placeholder="e.g., Spouse, Parent, Sibling" className="h-11" />
          </div>
          <Button variant="outline" className="w-full border-red-200 hover:bg-red-50 h-11">
            <Save className="h-4 w-4 mr-2" />
            Save Emergency Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}