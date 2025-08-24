"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { showToast } from "@/components/ui/toast-helper"

interface Doctor {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  specialization: string
  licenseNumber: string
  experience: number
  consultationFee: number
  bio?: string
}

interface EditDoctorFormProps {
  doctor: Doctor
  onSuccess: () => void
  onCancel: () => void
}

export function EditDoctorForm({ doctor, onSuccess, onCancel }: EditDoctorFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [specializations, setSpecializations] = useState<{name: string}[]>([])
  const [formData, setFormData] = useState({
    firstName: doctor.firstName,
    lastName: doctor.lastName,
    email: doctor.email,
    phone: doctor.phone,
    specialization: doctor.specialization,
    licenseNumber: doctor.licenseNumber,
    experience: doctor.experience.toString(),
    consultationFee: doctor.consultationFee.toString(),
    bio: doctor.bio || ""
  })

  useEffect(() => {
    fetchSpecializations()
  }, [])

  const fetchSpecializations = async () => {
    try {
      const response = await fetch("/api/specializations")
      if (response.ok) {
        const data = await response.json()
        setSpecializations(data.specializations || [])
      }
    } catch (error) {
      console.error('Failed to fetch specializations:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/doctors/${doctor._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          experience: parseInt(formData.experience),
          consultationFee: parseInt(formData.consultationFee)
        }),
      })

      if (response.ok) {
        showToast.success("Doctor updated successfully")
        onSuccess()
      } else {
        const error = await response.json()
        showToast.error("Update failed", error.message)
      }
    } catch (error) {
      showToast.error("Error", "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialization">Specialization</Label>
        <Select value={formData.specialization} onValueChange={(value) => handleChange("specialization", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select specialization" />
          </SelectTrigger>
          <SelectContent>
            {specializations.map((spec) => (
              <SelectItem key={spec.name} value={spec.name}>
                {spec.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="licenseNumber">License Number</Label>
          <Input
            id="licenseNumber"
            value={formData.licenseNumber}
            onChange={(e) => handleChange("licenseNumber", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="experience">Experience (years)</Label>
          <Input
            id="experience"
            type="number"
            min="0"
            value={formData.experience}
            onChange={(e) => handleChange("experience", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="consultationFee">Consultation Fee (₦)</Label>
        <Input
          id="consultationFee"
          type="number"
          min="0"
          value={formData.consultationFee}
          onChange={(e) => handleChange("consultationFee", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          rows={3}
          value={formData.bio}
          onChange={(e) => handleChange("bio", e.target.value)}
          placeholder="Brief description about the doctor..."
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Doctor"}
        </Button>
      </div>
    </form>
  )
}