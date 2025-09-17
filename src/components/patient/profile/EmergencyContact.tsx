import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export function EmergencyContact() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Emergency Contact</CardTitle>
        <CardDescription>Important contact for emergencies</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emergencyName">Contact Name</Label>
            <Input id="emergencyName" placeholder="Full name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergencyPhone">Phone Number</Label>
            <Input id="emergencyPhone" type="tel" placeholder="Phone number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergencyRelation">Relationship</Label>
            <Input id="emergencyRelation" placeholder="e.g., Spouse, Parent, Sibling" />
          </div>

        </div>
      </CardContent>
    </Card>
  )
}