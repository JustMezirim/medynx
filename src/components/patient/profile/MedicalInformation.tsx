import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"


export function MedicalInformation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical Information</CardTitle>
        <CardDescription>Important details for healthcare providers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies</Label>
            <Textarea id="allergies" rows={3} placeholder="List any known allergies..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="medications">Current Medications</Label>
            <Textarea id="medications" rows={3} placeholder="List current medications..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="conditions">Medical Conditions</Label>
            <Textarea id="conditions" rows={3} placeholder="List any chronic conditions..." />
          </div>

        </div>
      </CardContent>
    </Card>
  )
}