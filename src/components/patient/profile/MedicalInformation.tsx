import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Save } from "lucide-react"

export function MedicalInformation() {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
        <CardTitle className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Heart className="h-5 w-5 text-green-600" />
          </div>
          <span>Medical Information</span>
        </CardTitle>
        <CardDescription>Important details for healthcare providers</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="allergies" className="text-sm font-semibold text-gray-700">Allergies</Label>
            <Textarea id="allergies" rows={3} placeholder="List any known allergies..." className="resize-none" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="medications" className="text-sm font-semibold text-gray-700">Current Medications</Label>
            <Textarea id="medications" rows={3} placeholder="List current medications..." className="resize-none" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="conditions" className="text-sm font-semibold text-gray-700">Medical Conditions</Label>
            <Textarea id="conditions" rows={3} placeholder="List any chronic conditions..." className="resize-none" />
          </div>
          <Button variant="outline" className="w-full border-green-200 hover:bg-green-50 h-11">
            <Save className="h-4 w-4 mr-2" />
            Save Medical Information
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}