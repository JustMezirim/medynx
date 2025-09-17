"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogFooter } from "@/components/ui/dialog"
import { showToast } from "@/components/ui/toast-helper"

interface AddUserFormProps {
  userType: "doctor" | "patient"
  onSuccess: () => void
  onCancel: () => void
}

export function AddUserForm({ userType, onSuccess, onCancel }: AddUserFormProps) {
  const [loading, setLoading] = useState(false)
  const [specializations, setSpecializations] = useState<{name: string}[]>([])
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    specialization: "",
    licenseNumber: "",
    experience: "",
    consultationFee: "",
    dateOfBirth: "",
    gender: "",
  })

  useEffect(() => {
    if (userType === "doctor") {
      fetchSpecializations()
    }
  }, [userType])

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
    setLoading(true)

    try {
      const payload = {
        ...formData,
        role: userType,
        ...(userType === "doctor" && {
          experience: parseInt(formData.experience) || 0,
          consultationFee: parseFloat(formData.consultationFee) || 0,
        }),
      }

      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        showToast.success(`${userType === "doctor" ? "Doctor" : "Patient"} created successfully`)
        onSuccess()
      } else {
        const data = await response.json()
        showToast.error(data.message || "Failed to create user")
      }
    } catch (error) {
      console.error("Error creating user:", error)
      showToast.error("Failed to create user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </div>

      {userType === "doctor" && (
        <>
          <div>
            <Label htmlFor="specialization">Specialization</Label>
            <Select value={formData.specialization} onValueChange={(value) => setFormData({ ...formData, specialization: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select specialization" />
              </SelectTrigger>
              <SelectContent>
                {specializations.map(spec => (
                  <SelectItem key={spec.name} value={spec.name}>
                    {spec.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input
                id="licenseNumber"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="experience">Experience (years)</Label>
              <Input
                id="experience"
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="consultationFee">Consultation Fee (₦)</Label>
            <Input
              id="consultationFee"
              type="number"
              step="0.01"
              value={formData.consultationFee}
              onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
              required
            />
          </div>
        </>
      )}

      {userType === "patient" && (
        <>
          <div>
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : `Create ${userType === "doctor" ? "Doctor" : "Patient"}`}
        </Button>
      </DialogFooter>
    </form>
  )
}